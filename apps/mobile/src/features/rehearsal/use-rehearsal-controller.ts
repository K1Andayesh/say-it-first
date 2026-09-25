import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Crypto from "expo-crypto";
import * as Haptics from "expo-haptics";

import type {
  EmployeePersona,
  PracticeEvaluation,
  ScenarioDefinition,
  TranscriptTurn,
} from "@say-it-first/contracts";
import {
  canTransitionPracticeSession,
  personas,
  scenarios,
  type PracticeSessionState,
} from "@say-it-first/domain";

import { evaluatePractice } from "@/services/api/api-client";
import { diagnosticLog } from "@/services/diagnostics/diagnostic-log";
import { getOrCreateAnonymousUserId } from "@/services/identity/anonymous-id";
import {
  RealtimeVoiceClient,
  type RealtimeConnectionState,
} from "@/services/realtime/realtime-client";
import {
  transcriptFromRealtimeEvent,
  type RealtimeEvent,
} from "@/services/realtime/realtime-events";

function requireFirst<T>(values: readonly T[], label: string): T {
  const first = values[0];
  if (!first) throw new Error(`The rehearsal spike requires one ${label}.`);
  return first;
}

const scenario = requireFirst<ScenarioDefinition>(scenarios, "scenario");
const persona = requireFirst<EmployeePersona>(personas, "persona");

export type VoicePresence = "quiet" | "waiting" | "listening" | "thinking" | "speaking";

type RehearsalError = {
  title: string;
  message: string;
  retryable: boolean;
};

export type RehearsalController = {
  scenario: ScenarioDefinition;
  persona: EmployeePersona;
  sessionState: PracticeSessionState;
  connectionState: RealtimeConnectionState | "idle";
  voicePresence: VoicePresence;
  transcript: readonly TranscriptTurn[];
  evaluation: PracticeEvaluation | null;
  error: RehearsalError | null;
  muted: boolean;
  holdToTalkEnabled: boolean;
  holdingToTalk: boolean;
  elapsedSeconds: number;
  start: () => Promise<void>;
  end: () => Promise<void>;
  toggleMute: () => void;
  toggleHoldToTalk: () => void;
  beginHoldToTalk: () => void;
  endHoldToTalk: () => void;
  reset: () => void;
};

function presenceFromEvent(event: RealtimeEvent): VoicePresence | null {
  if (event.type === "input_audio_buffer.speech_started") return "listening";
  if (event.type === "input_audio_buffer.speech_stopped") return "thinking";
  if (event.type === "response.created") return "thinking";
  if (event.type.includes("output_audio") && event.type.endsWith(".delta")) return "speaking";
  if (event.type === "response.done") return "listening";
  return null;
}

function publicConnectionMessage(error: Error): RehearsalError {
  const permissionDenied = /permission|notallowed|denied/i.test(error.message);
  return permissionDenied
    ? {
        title: "Microphone access is needed",
        message: "Allow microphone access, then try the private rehearsal again.",
        retryable: true,
      }
    : {
        title: "The rehearsal room didn’t open",
        message: "Your session was not started. Check the connection and try once more.",
        retryable: true,
      };
}

export function useRehearsalController(): RehearsalController {
  const [sessionState, setSessionState] = useState<PracticeSessionState>("idle");
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState | "idle">("idle");
  const [voicePresence, setVoicePresence] = useState<VoicePresence>("quiet");
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null);
  const [error, setError] = useState<RehearsalError | null>(null);
  const [muted, setMuted] = useState(false);
  const [holdToTalkEnabled, setHoldToTalkEnabled] = useState(false);
  const [holdingToTalk, setHoldingToTalk] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const clientRef = useRef<RealtimeVoiceClient | null>(null);
  const sessionStateRef = useRef<PracticeSessionState>("idle");
  const startedAtRef = useRef<number | null>(null);
  const transcriptRef = useRef<TranscriptTurn[]>([]);
  const endingRef = useRef(false);
  const holdToTalkEnabledRef = useRef(false);

  const moveTo = useCallback((next: PracticeSessionState): boolean => {
    const current = sessionStateRef.current;
    if (!canTransitionPracticeSession(current, next)) {
      diagnosticLog.record("warn", "rehearsal.state.transition_rejected", {
        from: current,
        to: next,
      });
      return false;
    }

    sessionStateRef.current = next;
    setSessionState(next);
    diagnosticLog.record("info", "rehearsal.state.changed", { from: current, to: next });
    return true;
  }, []);

  const replaceTranscript = useCallback((next: TranscriptTurn[]) => {
    transcriptRef.current = next;
    setTranscript(next);
  }, []);

  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      const nextPresence =
        event.type === "response.done" && holdToTalkEnabledRef.current
          ? "waiting"
          : presenceFromEvent(event);
      if (nextPresence) setVoicePresence(nextPresence);

      if (
        event.type === "input_audio_buffer.speech_started" &&
        sessionStateRef.current === "ready"
      ) {
        moveTo("active");
      }

      const completed = transcriptFromRealtimeEvent(event);
      if (!completed) return;
      if (transcriptRef.current.some((turn) => turn.id === completed.id)) return;

      const elapsedMs = startedAtRef.current ? Date.now() - startedAtRef.current : null;
      replaceTranscript([
        ...transcriptRef.current,
        {
          id: completed.id,
          sequence: transcriptRef.current.length,
          speaker: completed.speaker,
          text: completed.text,
          startedAtMs: elapsedMs,
          endedAtMs: elapsedMs,
        },
      ]);
      diagnosticLog.record("debug", "rehearsal.turn.completed", {
        speaker: completed.speaker,
        sequence: transcriptRef.current.length - 1,
      });
    },
    [moveTo, replaceTranscript],
  );

  const handleConnectionState = useCallback(
    (next: RealtimeConnectionState) => {
      setConnectionState(next);
      if (next === "failed") {
        setError({
          title: "The voice connection was lost",
          message: "End this attempt safely, then start a fresh rehearsal.",
          retryable: true,
        });
      }
      if (next === "connected" && sessionStateRef.current === "connecting") {
        moveTo("ready");
        setVoicePresence("listening");
        startedAtRef.current = Date.now();
      }
      if (
        next === "failed" &&
        (sessionStateRef.current === "connecting" || sessionStateRef.current === "authorising")
      ) {
        moveTo("connection_failed");
      }
    },
    [moveTo],
  );

  const start = useCallback(async () => {
    const current = sessionStateRef.current;
    if (!["idle", "blocked", "connection_failed"].includes(current)) return;

    setError(null);
    setEvaluation(null);
    replaceTranscript([]);
    setElapsedSeconds(0);
    setMuted(false);
    setHoldToTalkEnabled(false);
    holdToTalkEnabledRef.current = false;
    setHoldingToTalk(false);
    setVoicePresence("quiet");
    endingRef.current = false;
    moveTo("authorising");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const anonymousUserId = await getOrCreateAnonymousUserId();
      if (!moveTo("connecting")) return;

      const client = new RealtimeVoiceClient({
        onConnectionState: handleConnectionState,
        onEvent: handleRealtimeEvent,
        onError: (connectionError) => setError(publicConnectionMessage(connectionError)),
      });
      clientRef.current = client;
      await client.start({
        scenarioId: scenario.id,
        personaId: persona.id,
        anonymousUserId,
      });
    } catch (startError) {
      const normalized = startError instanceof Error ? startError : new Error("Connection failed.");
      setError(publicConnectionMessage(normalized));
      if (sessionStateRef.current === "authorising") moveTo("blocked");
      else if (sessionStateRef.current === "connecting") moveTo("connection_failed");
    }
  }, [handleConnectionState, handleRealtimeEvent, moveTo, replaceTranscript]);

  const evaluateCurrentTranscript = useCallback(async () => {
    if (!moveTo("evaluating")) return;
    const turns = transcriptRef.current;
    if (!turns.some((turn) => turn.speaker === "user")) {
      setError({
        title: "There isn’t enough to coach yet",
        message: "Try again and say at least one full sentence before ending the rehearsal.",
        retryable: true,
      });
      moveTo("evaluation_failed");
      return;
    }

    try {
      const result = await evaluatePractice({
        practiceSessionId: Crypto.randomUUID(),
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
        personaId: persona.id,
        transcript: turns,
      });
      setEvaluation(result.evaluation);
      moveTo("completed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setError({
        title: "Feedback is taking longer than it should",
        message: "Your rehearsal is still on this device. Retry the feedback when you’re ready.",
        retryable: true,
      });
      moveTo("evaluation_failed");
    }
  }, [moveTo]);

  const end = useCallback(async () => {
    if (endingRef.current) return;
    const current = sessionStateRef.current;

    if (current === "interrupted" || current === "evaluation_failed") {
      await evaluateCurrentTranscript();
      return;
    }
    if (!["ready", "active", "paused"].includes(current)) return;

    endingRef.current = true;
    moveTo("ending");
    setVoicePresence("quiet");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clientRef.current?.stop();
    clientRef.current = null;
    await evaluateCurrentTranscript();
    endingRef.current = false;
  }, [evaluateCurrentTranscript, moveTo]);

  const toggleMute = useCallback(() => {
    if (holdToTalkEnabled) return;
    const nextMuted = !muted;
    const current = sessionStateRef.current;
    if (nextMuted && current === "active") moveTo("paused");
    else if (!nextMuted && current === "paused") moveTo("active");
    clientRef.current?.setMuted(nextMuted);
    setMuted(nextMuted);
    void Haptics.selectionAsync();
  }, [holdToTalkEnabled, moveTo, muted]);

  const toggleHoldToTalk = useCallback(() => {
    const nextEnabled = !holdToTalkEnabled;
    if (!clientRef.current?.setTurnMode(nextEnabled ? "hold_to_talk" : "automatic")) {
      setError({
        title: "Hold-to-talk is not ready yet",
        message: "Wait for the voice connection, then try the control again.",
        retryable: true,
      });
      return;
    }
    setError(null);
    setHoldToTalkEnabled(nextEnabled);
    holdToTalkEnabledRef.current = nextEnabled;
    setHoldingToTalk(false);
    setMuted(nextEnabled);
    setVoicePresence(nextEnabled ? "waiting" : "listening");
    const current = sessionStateRef.current;
    if (nextEnabled && current === "active") moveTo("paused");
    else if (!nextEnabled && current === "paused") moveTo("active");
    void Haptics.selectionAsync();
  }, [holdToTalkEnabled, moveTo]);

  const beginHoldToTalk = useCallback(() => {
    if (!holdToTalkEnabled || !clientRef.current?.beginHoldToTalk()) return;
    const current = sessionStateRef.current;
    if (current === "ready" || current === "paused") moveTo("active");
    setHoldingToTalk(true);
    setMuted(false);
    setVoicePresence("listening");
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [holdToTalkEnabled, moveTo]);

  const endHoldToTalk = useCallback(() => {
    if (!holdToTalkEnabled || !clientRef.current?.endHoldToTalk()) return;
    if (sessionStateRef.current === "active") moveTo("paused");
    setHoldingToTalk(false);
    setMuted(true);
    setVoicePresence("thinking");
    void Haptics.selectionAsync();
  }, [holdToTalkEnabled, moveTo]);

  const reset = useCallback(() => {
    void clientRef.current?.stop();
    clientRef.current = null;
    sessionStateRef.current = "idle";
    setSessionState("idle");
    setConnectionState("idle");
    setVoicePresence("quiet");
    replaceTranscript([]);
    setEvaluation(null);
    setError(null);
    setMuted(false);
    setHoldToTalkEnabled(false);
    holdToTalkEnabledRef.current = false;
    setHoldingToTalk(false);
    setElapsedSeconds(0);
    startedAtRef.current = null;
    endingRef.current = false;
    diagnosticLog.record("info", "rehearsal.session.reset");
  }, [replaceTranscript]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!startedAtRef.current) return;
      if (!["ready", "active", "paused"].includes(sessionStateRef.current)) return;
      setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1_000));
    }, 1_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleAppState = (next: AppStateStatus) => {
      if (next === "active") return;
      if (!["ready", "active", "paused"].includes(sessionStateRef.current)) return;

      diagnosticLog.record("warn", "rehearsal.session.interrupted", { appState: next });
      moveTo("interrupted");
      setVoicePresence("quiet");
      setError({
        title: "The live session ended safely",
        message: "Leaving the app closes the microphone connection. You can still request feedback.",
        retryable: true,
      });
      void clientRef.current?.stop();
      clientRef.current = null;
    };

    const subscription = AppState.addEventListener("change", handleAppState);
    return () => subscription.remove();
  }, [moveTo]);

  useEffect(
    () => () => {
      void clientRef.current?.stop();
      clientRef.current = null;
    },
    [],
  );

  return {
    scenario,
    persona,
    sessionState,
    connectionState,
    voicePresence,
    transcript,
    evaluation,
    error,
    muted,
    holdToTalkEnabled,
    holdingToTalk,
    elapsedSeconds,
    start,
    end,
    toggleMute,
    toggleHoldToTalk,
    beginHoldToTalk,
    endHoldToTalk,
    reset,
  };
}
