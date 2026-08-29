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

  it("keeps the microphone gated when the server rejects an individual operation", () => {
    const playing = { responseActive: true, audioPlaying: true };

    expect(nextAssistantAudioGateState(playing, event("error"))).toEqual(playing);
  });

  it("keeps the microphone gated when an operation fails before audio starts", () => {
    const generating = { responseActive: true, audioPlaying: false };

    expect(nextAssistantAudioGateState(generating, event("response.failed"))).toEqual(generating);
  });

  it("does not reopen the microphone for a non-fatal transcription failure", () => {
    const playing = { responseActive: true, audioPlaying: true };

    expect(
      nextAssistantAudioGateState(
        playing,
        event("conversation.item.input_audio_transcription.failed"),
      ),
    ).toEqual(playing);
  });
});

describe("Realtime response completion diagnostics", () => {
  it("captures completed response usage", () => {
    expect(
      responseCompletionFromRealtimeEvent({
        type: "response.done",
        response: {
          status: "completed",
          status_details: null,
          usage: {
            total_tokens: 320,
            output_tokens: 120,
            output_token_details: { audio_tokens: 100, text_tokens: 20 },
          },
        },
      }),
    ).toEqual({
      status: "completed",
      reason: null,
      totalUnits: 320,
      outputUnits: 120,
      audioUnits: 100,
      textUnits: 20,
    });
  });

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
