import { describe, expect, it } from "vitest";

import {
  holdToTalkFinishEvents,
  holdToTalkStartEvents,
  turnModeUpdateEvent,
} from "./realtime-turn-control";

describe("realtime turn control", () => {
  it("disables VAD for hold-to-talk mode", () => {
    expect(turnModeUpdateEvent("hold_to_talk")).toEqual({
      type: "session.update",
      session: {
        type: "realtime",
        audio: { input: { turn_detection: null } },
      },
    });
  });

  it("restores the production automatic-turn settings", () => {
    expect(turnModeUpdateEvent("automatic")).toMatchObject({
      type: "session.update",
      session: {
        audio: {
          input: {
            turn_detection: {
              type: "server_vad",
              create_response: true,
              interrupt_response: false,
              silence_duration_ms: 750,
            },
          },
        },
      },
    });
  });

  it("clears pending input before a held turn", () => {
    expect(holdToTalkStartEvents(false)).toEqual([{ type: "input_audio_buffer.clear" }]);
  });

  it("cancels and clears assistant audio when a held turn interrupts Alex", () => {
    expect(holdToTalkStartEvents(true)).toEqual([
      { type: "response.cancel" },
      { type: "output_audio_buffer.clear" },
      { type: "input_audio_buffer.clear" },
    ]);
  });

  it("commits held audio before requesting a response", () => {
    expect(holdToTalkFinishEvents()).toEqual([
      { type: "input_audio_buffer.commit" },
      { type: "response.create" },
    ]);
  });
});
