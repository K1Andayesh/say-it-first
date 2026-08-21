import { describe, expect, it } from "vitest";

import { buildOpenAIRealtimeSession } from "./openai-realtime-provider.js";

describe("OpenAI Realtime session configuration", () => {
  it("does not impose a text-sized token cap on audio responses", () => {
    const session = buildOpenAIRealtimeSession({
      model: "test-realtime",
      voice: "test-voice",
      instructions: "Stay in role and answer concisely.",
    });

    expect(session.max_output_tokens).toBe("inf");
    expect(session.output_modalities).toEqual(["audio"]);
    expect(session.audio.input.turn_detection.interrupt_response).toBe(false);
  });
});
