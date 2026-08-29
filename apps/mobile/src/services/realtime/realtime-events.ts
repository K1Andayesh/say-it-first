import type { TranscriptSpeaker } from "@say-it-first/contracts";

export type RealtimeEvent = Readonly<Record<string, unknown>> & { type: string };

export type CompletedTranscriptEvent = {
  id: string;
  speaker: TranscriptSpeaker;
  text: string;
};

export type AssistantAudioGateState = {
  responseActive: boolean;
  audioPlaying: boolean;
};

export type RealtimeResponseCompletion = {
  status: string;
  reason: string | null;
  totalUnits: number | null;
  outputUnits: number | null;
  audioUnits: number | null;
  textUnits: number | null;
};

export const idleAssistantAudioGateState: AssistantAudioGateState = {
  responseActive: false,
  audioPlaying: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function parseRealtimeEvent(payload: string): RealtimeEvent | null {
  try {
    const value: unknown = JSON.parse(payload);
    if (!isRecord(value)) return null;
    const type = value.type;
    return typeof type === "string" ? { ...value, type } : null;
  } catch {
    return null;
  }
}

export function nextAssistantAudioGateState(
  current: AssistantAudioGateState,
  event: RealtimeEvent,
): AssistantAudioGateState {
  if (event.type === "response.created") {
    return { responseActive: true, audioPlaying: false };
  }

  if (event.type === "output_audio_buffer.started") {
    return { responseActive: true, audioPlaying: true };
  }

  if (
    event.type === "output_audio_buffer.stopped" ||
    event.type === "output_audio_buffer.cleared"
  ) {
    return idleAssistantAudioGateState;
  }

  if (event.type === "response.done" && !current.audioPlaying) {
    return idleAssistantAudioGateState;
  }

  return current;
}

function stringField(event: RealtimeEvent, key: string): string | null {
  const value = event[key];
  return typeof value === "string" && value.trim() ? value : null;
}

function numberField(record: Record<string, unknown> | null, key: string): number | null {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function recordField(record: Record<string, unknown> | null, key: string): Record<string, unknown> | null {
  const value = record?.[key];
  return isRecord(value) ? value : null;
}

export function responseCompletionFromRealtimeEvent(
  event: RealtimeEvent,
): RealtimeResponseCompletion | null {
  if (event.type !== "response.done") return null;
  const response = recordField(event, "response");
  if (!response) return null;

  const status = response.status;
  if (typeof status !== "string") return null;

  const statusDetails = recordField(response, "status_details");
  const usage = recordField(response, "usage");
  const outputDetails = recordField(usage, "output_token_details");
  const reasonValue = statusDetails?.reason ?? statusDetails?.type;

  return {
    status,
    reason: typeof reasonValue === "string" ? reasonValue : null,
    totalUnits: numberField(usage, "total_tokens"),
    outputUnits: numberField(usage, "output_tokens"),
    audioUnits: numberField(outputDetails, "audio_tokens"),
    textUnits: numberField(outputDetails, "text_tokens"),
  };
}

export function transcriptFromRealtimeEvent(event: RealtimeEvent): CompletedTranscriptEvent | null {
  if (event.type === "conversation.item.input_audio_transcription.completed") {
    const text = stringField(event, "transcript");
    const itemId = stringField(event, "item_id");
    return text && itemId ? { id: `user-${itemId}`, speaker: "user", text } : null;
  }

  if (
    event.type === "response.output_audio_transcript.done" ||
    event.type === "response.audio_transcript.done"
  ) {
    const text = stringField(event, "transcript");
    const itemId = stringField(event, "item_id") ?? stringField(event, "response_id");
    return text && itemId ? { id: `employee-${itemId}`, speaker: "employee", text } : null;
  }

  return null;
}
