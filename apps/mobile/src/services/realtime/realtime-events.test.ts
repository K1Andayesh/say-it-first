import { describe, expect, it } from "vitest";

import {
  idleAssistantAudioGateState,
  nextAssistantAudioGateState,
  responseCompletionFromRealtimeEvent,
  type RealtimeEvent,
} from "./realtime-events";

function event(type: string): RealtimeEvent {
  return { type };
}

describe("assistant audio microphone gate", () => {
  it("gates from response creation until buffered audio stops", () => {
    const generating = nextAssistantAudioGateState(
      idleAssistantAudioGateState,
      event("response.created"),
    );
    const playing = nextAssistantAudioGateState(generating, event("output_audio_buffer.started"));
    const responseDone = nextAssistantAudioGateState(playing, event("response.done"));
    const stopped = nextAssistantAudioGateState(
      responseDone,
      event("output_audio_buffer.stopped"),
    );

    expect(generating).toEqual({ responseActive: true, audioPlaying: false });
    expect(playing).toEqual({ responseActive: true, audioPlaying: true });
    expect(responseDone).toEqual(playing);
    expect(stopped).toEqual(idleAssistantAudioGateState);
  });

  it("reopens when a response completes without starting audio", () => {
    const generating = nextAssistantAudioGateState(
      idleAssistantAudioGateState,
      event("response.created"),
    );

    expect(nextAssistantAudioGateState(generating, event("response.done"))).toEqual(
      idleAssistantAudioGateState,
    );
  });

  it("fails open after a provider error so the next turn can recover", () => {
    const playing = { responseActive: true, audioPlaying: true };

    expect(nextAssistantAudioGateState(playing, event("response.failed"))).toEqual(
      idleAssistantAudioGateState,
    );
  });
});

describe("Realtime response completion diagnostics", () => {
  it("surfaces a max-output response as incomplete", () => {
    expect(
      responseCompletionFromRealtimeEvent({
        type: "response.done",
        response: {
          status: "incomplete",
          status_details: { type: "incomplete", reason: "max_output_tokens" },
          usage: {
            total_tokens: 480,
            output_tokens: 280,
            output_token_details: { audio_tokens: 244, text_tokens: 36 },
          },
        },
      }),
    ).toEqual({
      status: "incomplete",
      reason: "max_output_tokens",
      totalUnits: 480,
      outputUnits: 280,
      audioUnits: 244,
      textUnits: 36,
    });
  });
});
