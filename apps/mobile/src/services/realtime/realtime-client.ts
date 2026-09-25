import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  type MediaStream,
} from "react-native-webrtc";

import {
  createCorrelation,
  fetchWithTimeout,
  getApiBaseUrl,
} from "@/services/api/api-client";
import { diagnosticLog } from "@/services/diagnostics/diagnostic-log";
import {
  inboundAudioStatsFromReport,
  summarizeInboundAudioQuality,
  type InboundAudioStatsSnapshot,
} from "./realtime-audio-quality";
import { RealtimeAudioSession } from "./realtime-audio-session";
import {
  idleAssistantAudioGateState,
  nextAssistantAudioGateState,
  parseRealtimeEvent,
  responseCompletionFromRealtimeEvent,
  type AssistantAudioGateState,
  type RealtimeEvent,
} from "./realtime-events";
import {
  holdToTalkFinishEvents,
  holdToTalkStartEvents,
  turnModeUpdateEvent,
  type RealtimeClientEvent,
  type RealtimeTurnMode,
} from "./realtime-turn-control";

export type RealtimeConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed"
  | "closed";

export type RealtimeClientCallbacks = {
  onConnectionState(state: RealtimeConnectionState): void;
  onEvent(event: RealtimeEvent): void;
  onError(error: Error): void;
};

type StartRealtimeInput = {
  scenarioId: string;
  personaId: string;
  anonymousUserId: string;
};

type TrackEventShape = { track: { kind: string }; streams: readonly unknown[] };
type MessageEventShape = { data: unknown };
type OfferDescription = { type: "offer"; sdp: string };

function isTrackEvent(value: unknown): value is TrackEventShape {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TrackEventShape>;
  return (
    typeof candidate.track?.kind === "string" &&
    Array.isArray(candidate.streams)
  );
}

function isMessageEvent(value: unknown): value is MessageEventShape {
  return Boolean(value && typeof value === "object" && "data" in value);
}

function isOfferDescription(value: unknown): value is OfferDescription {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<OfferDescription>;
  return candidate.type === "offer" && typeof candidate.sdp === "string";
}

function publicRealtimeErrorCode(event: RealtimeEvent): string {
  const directCode = event.code;
  if (typeof directCode === "string" && directCode.trim()) return directCode;

  const error = event.error;
  if (!error || typeof error !== "object" || Array.isArray(error)) return "unknown";
  const nestedCode = (error as Record<string, unknown>).code;
  return typeof nestedCode === "string" && nestedCode.trim() ? nestedCode : "unknown";
}

function waitForIceGathering(peerConnection: RTCPeerConnection, timeoutMs = 4_000): Promise<void> {
  if (peerConnection.iceGatheringState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    const listener = () => {
      if (peerConnection.iceGatheringState === "complete") {
        clearTimeout(timeout);
        peerConnection.onicegatheringstatechange = null;
        resolve();
      }
    };
    const timeout = setTimeout(() => {
      peerConnection.onicegatheringstatechange = null;
      resolve();
    }, timeoutMs);
    peerConnection.onicegatheringstatechange = listener;
  });
}

export class RealtimeVoiceClient {
  private readonly audioSession = new RealtimeAudioSession();
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: ReturnType<RTCPeerConnection["createDataChannel"]> | null = null;
  private localStream: MediaStream | null = null;
  private stopped = false;
  private userMuted = false;
  private turnMode: RealtimeTurnMode = "automatic";
  private holdToTalkActive = false;
  private assistantAudioGate: AssistantAudioGateState = idleAssistantAudioGateState;
  private microphoneEnabled: boolean | null = null;
  private lastSpeechStoppedAt: number | null = null;
  private qualityBaseline: Promise<InboundAudioStatsSnapshot | null> | null = null;
  private qualityUnavailableLogged = false;

  public constructor(private readonly callbacks: RealtimeClientCallbacks) {}

  public async start(input: StartRealtimeInput): Promise<void> {
    if (this.peerConnection) throw new Error("A realtime session is already active.");
    this.stopped = false;
    this.userMuted = false;
    this.turnMode = "automatic";
    this.holdToTalkActive = false;
    this.assistantAudioGate = idleAssistantAudioGateState;
    this.microphoneEnabled = null;
    this.lastSpeechStoppedAt = null;
    this.qualityBaseline = null;
    this.qualityUnavailableLogged = false;
    this.callbacks.onConnectionState("connecting");
    const correlation = createCorrelation();
    const startedAt = performance.now();

    diagnosticLog.record("info", "realtime.connection.started", {
      requestId: correlation.requestId,
      traceId: correlation.traceId,
      scenarioId: input.scenarioId,
      personaId: input.personaId,
    });

    try {
      await this.audioSession.start();
      const peerConnection = new RTCPeerConnection({ iceServers: [] });
      this.peerConnection = peerConnection;

      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        diagnosticLog.record(state === "failed" ? "error" : "debug", "realtime.peer.state", {
          state,
        });
        if (state === "connected") this.callbacks.onConnectionState("connected");
        else if (state === "disconnected") this.callbacks.onConnectionState("disconnected");
        else if (state === "failed") this.callbacks.onConnectionState("failed");
        else if (state === "closed") this.callbacks.onConnectionState("closed");
      };

      peerConnection.ontrack = (rawEvent: unknown) => {
        if (!isTrackEvent(rawEvent)) return;
        diagnosticLog.record("debug", "realtime.remote.track.received", {
          kind: rawEvent.track.kind,
          streamCount: rawEvent.streams.length,
        });
      };

      const localStream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.localStream = localStream;
      this.syncMicrophone("capture_started");
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      const dataChannel = peerConnection.createDataChannel("oai-events");
      this.dataChannel = dataChannel;
      dataChannel.onopen = () => {
        diagnosticLog.record("info", "realtime.data_channel.opened");
      };
      dataChannel.onclose = () => {
        diagnosticLog.record("info", "realtime.data_channel.closed");
      };
      dataChannel.onmessage = (rawMessage: unknown) => {
        if (!isMessageEvent(rawMessage) || typeof rawMessage.data !== "string") return;
        const event = parseRealtimeEvent(rawMessage.data);
        if (!event) {
          diagnosticLog.record("warn", "realtime.event.invalid");
          return;
        }
        this.handleTurnControlEvent(event);
        diagnosticLog.record("debug", "realtime.event.received", { type: event.type });
        if (event.type === "error" || event.type.endsWith(".failed")) {
          diagnosticLog.record(
            event.type === "error" ? "error" : "warn",
            "realtime.operation.failed",
            { eventType: event.type, errorCode: publicRealtimeErrorCode(event) },
          );
        }
        this.callbacks.onEvent(event);
      };

      const offer: unknown = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      if (!isOfferDescription(offer)) throw new Error("The device created an invalid SDP offer.");
      await peerConnection.setLocalDescription(offer);
      await waitForIceGathering(peerConnection);
      const sdp = peerConnection.localDescription?.sdp;
      if (!sdp) throw new Error("The device did not create an SDP offer.");

      const response = await fetchWithTimeout(
        `${getApiBaseUrl()}/api/v1/realtime/calls?scenarioId=${encodeURIComponent(input.scenarioId)}&personaId=${encodeURIComponent(input.personaId)}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/sdp",
            "x-anonymous-user-id": input.anonymousUserId,
            "x-request-id": correlation.requestId,
            traceparent: correlation.traceparent,
          },
          body: sdp,
        },
        12_000,
      );

      const answerSdp = await response.text();
      if (!response.ok) throw new Error(`Realtime session request failed (${response.status}).`);
      if (this.stopped) return;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSdp }),
      );
      await this.captureQualityBaseline();
      diagnosticLog.record("info", "realtime.connection.negotiated", {
        requestId: response.headers.get("x-request-id") ?? correlation.requestId,
        traceId: response.headers.get("x-trace-id") ?? correlation.traceId,
        model: response.headers.get("x-ai-model") ?? "unknown",
        durationMs: Math.round(performance.now() - startedAt),
      });
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error("Realtime connection failed.");
      diagnosticLog.record("error", "realtime.connection.failed", {
        errorType: normalized.name,
        durationMs: Math.round(performance.now() - startedAt),
      });
      this.callbacks.onError(normalized);
      this.stop();
      throw normalized;
    }
  }

  public setMuted(muted: boolean): void {
    if (this.turnMode === "hold_to_talk") return;
    this.userMuted = muted;
    this.syncMicrophone("user_control");
    diagnosticLog.record("info", "realtime.microphone.changed", { muted });
  }

  public setTurnMode(mode: RealtimeTurnMode): boolean {
    if (this.turnMode === mode) return true;
    if (!this.sendClientEvent(turnModeUpdateEvent(mode))) return false;

    this.turnMode = mode;
    this.holdToTalkActive = false;
    this.userMuted = mode === "hold_to_talk";
    this.syncMicrophone("turn_mode_changed");
    diagnosticLog.record("info", "realtime.turn_control.mode_changed", { mode });
    return true;
  }

  public beginHoldToTalk(): boolean {
    if (this.turnMode !== "hold_to_talk" || this.holdToTalkActive) return false;
    const assistantActive =
      this.assistantAudioGate.responseActive || this.assistantAudioGate.audioPlaying;
    const events = holdToTalkStartEvents(assistantActive);
    if (!events.every((event) => this.sendClientEvent(event))) return false;

    if (assistantActive) {
      this.assistantAudioGate = idleAssistantAudioGateState;
      this.qualityBaseline = null;
    }
    this.holdToTalkActive = true;
    this.userMuted = false;
    this.syncMicrophone("hold_to_talk_started");
    diagnosticLog.record("info", "realtime.turn_control.hold_started", {
      interruptedAssistant: assistantActive,
    });
    return true;
  }

  public endHoldToTalk(): boolean {
    if (this.turnMode !== "hold_to_talk" || !this.holdToTalkActive) return false;
    this.holdToTalkActive = false;
    this.userMuted = true;
    this.syncMicrophone("hold_to_talk_released");
    const sent = holdToTalkFinishEvents().every((event) => this.sendClientEvent(event));
    diagnosticLog.record(sent ? "info" : "warn", "realtime.turn_control.hold_committed", {
      sent,
    });
    return sent;
  }

  private sendClientEvent(event: RealtimeClientEvent): boolean {
    const dataChannel = this.dataChannel;
    if (!dataChannel || dataChannel.readyState !== "open") {
      diagnosticLog.record("warn", "realtime.client_event.not_sent", {
        eventType: event.type,
        channelState: dataChannel?.readyState ?? "missing",
      });
      return false;
    }

    try {
      dataChannel.send(JSON.stringify(event));
      diagnosticLog.record("debug", "realtime.client_event.sent", { eventType: event.type });
      return true;
    } catch (error) {
      diagnosticLog.record("warn", "realtime.client_event.failed", {
        eventType: event.type,
        errorType: error instanceof Error ? error.name : "UnknownError",
      });
      return false;
    }
  }

  private handleTurnControlEvent(event: RealtimeEvent): void {
    if (event.type === "input_audio_buffer.speech_stopped") {
      this.lastSpeechStoppedAt = performance.now();
    }

    if (event.type === "output_audio_buffer.started" && this.lastSpeechStoppedAt !== null) {
      diagnosticLog.record("info", "realtime.turn.audio_started", {
        turnLatencyMs: Math.round(performance.now() - this.lastSpeechStoppedAt),
      });
      this.lastSpeechStoppedAt = null;
    }

    if (event.type === "output_audio_buffer.started") {
      this.qualityBaseline = this.readInboundAudioStats();
    } else if (event.type === "output_audio_buffer.stopped") {
      const baseline = this.qualityBaseline;
      this.qualityBaseline = null;
      void this.recordTurnAudioQuality(baseline);
    }

    const previous = this.assistantAudioGate;
    const next = nextAssistantAudioGateState(previous, event);
    if (next !== previous) {
      this.assistantAudioGate = next;
      this.syncMicrophone(`assistant_event:${event.type}`);
    }

    if (event.type === "response.done" || event.type === "error" || event.type.endsWith(".failed")) {
      this.lastSpeechStoppedAt = null;
    }

    const completion = responseCompletionFromRealtimeEvent(event);
    if (completion) {
      diagnosticLog.record(
        completion.status === "completed" ? "info" : "warn",
        "realtime.response.completed",
        {
          status: completion.status,
          reason: completion.reason,
          totalUnits: completion.totalUnits,
          outputUnits: completion.outputUnits,
          speechUnits: completion.audioUnits,
          textUnits: completion.textUnits,
        },
      );
    }
  }

  private async captureQualityBaseline(): Promise<void> {
    this.qualityBaseline = this.readInboundAudioStats();
    await this.qualityBaseline;
  }

  private async readInboundAudioStats(): Promise<InboundAudioStatsSnapshot | null> {
    const peerConnection = this.peerConnection;
    if (!peerConnection || peerConnection.connectionState === "closed") return null;

    try {
      const report: unknown = await peerConnection.getStats();
      if (!(report instanceof Map)) return null;
      return inboundAudioStatsFromReport(report);
    } catch (error) {
      if (!this.qualityUnavailableLogged) {
        this.qualityUnavailableLogged = true;
        diagnosticLog.record("warn", "realtime.quality.unavailable", {
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
      }
      return null;
    }
  }

  private async recordTurnAudioQuality(
    baseline: Promise<InboundAudioStatsSnapshot | null> | null,
  ): Promise<void> {
    const start = await baseline;
    const end = await this.readInboundAudioStats();
    if (!start || !end) {
      if (!this.qualityUnavailableLogged) {
        this.qualityUnavailableLogged = true;
        diagnosticLog.record("warn", "realtime.quality.unavailable", {
          errorType: "InboundStatsMissing",
        });
      }
      return;
    }

    const summary = summarizeInboundAudioQuality(start, end);
    diagnosticLog.record(
      summary.quality === "degraded" ? "warn" : "info",
      "realtime.turn.quality",
      summary,
    );
  }

  private syncMicrophone(reason: string): void {
    const assistantTurnActive =
      this.assistantAudioGate.responseActive || this.assistantAudioGate.audioPlaying;
    const enabled = !this.stopped && !this.userMuted && !assistantTurnActive;
    const tracks = this.localStream?.getAudioTracks() ?? [];
    let changed = false;

    tracks.forEach((track) => {
      if (track.enabled === enabled) return;
      track.enabled = enabled;
      changed = true;
    });

    if (!changed && this.microphoneEnabled === enabled) return;
    this.microphoneEnabled = enabled;
    diagnosticLog.record("info", "realtime.microphone.gate_changed", {
      enabled,
      userMuted: this.userMuted,
      assistantTurnActive,
      reason,
    });
  }

  public stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    diagnosticLog.record("info", "realtime.connection.stopping");
    this.syncMicrophone("connection_stopping");
    this.dataChannel?.close();
    this.dataChannel = null;
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream?.release();
    this.localStream = null;
    this.turnMode = "automatic";
    this.holdToTalkActive = false;
    this.qualityBaseline = null;
    this.peerConnection?.close();
    this.peerConnection = null;
    this.audioSession.stop();
    diagnosticLog.record("info", "realtime.connection.stopped");
    this.callbacks.onConnectionState("closed");
  }
}
