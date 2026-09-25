export type RealtimeTurnMode = "automatic" | "hold_to_talk";

export type RealtimeClientEvent = Readonly<Record<string, unknown>> & { type: string };

const automaticTurnDetection = {
  type: "server_vad",
  create_response: true,
  interrupt_response: false,
  prefix_padding_ms: 300,
  silence_duration_ms: 750,
  threshold: 0.65,
} as const;

export function turnModeUpdateEvent(mode: RealtimeTurnMode): RealtimeClientEvent {
  return {
    type: "session.update",
    session: {
      type: "realtime",
      audio: {
        input: {
          turn_detection: mode === "automatic" ? automaticTurnDetection : null,
        },
      },
    },
  };
}

export function holdToTalkStartEvents(interruptAssistant: boolean): RealtimeClientEvent[] {
  const events: RealtimeClientEvent[] = [];
  if (interruptAssistant) {
    events.push({ type: "response.cancel" }, { type: "output_audio_buffer.clear" });
  }
  events.push({ type: "input_audio_buffer.clear" });
  return events;
}

export function holdToTalkFinishEvents(): RealtimeClientEvent[] {
  return [{ type: "input_audio_buffer.commit" }, { type: "response.create" }];
}
