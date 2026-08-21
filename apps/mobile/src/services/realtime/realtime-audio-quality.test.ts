import { describe, expect, it } from "vitest";

import {
  inboundAudioStatsFromReport,
  summarizeInboundAudioQuality,
  type InboundAudioStatsSnapshot,
} from "./realtime-audio-quality";

const baseline: InboundAudioStatsSnapshot = {
  packetsReceived: 100,
  packetsLost: 1,
  jitterSeconds: 0.01,
  jitterBufferDelaySeconds: 2,
  jitterBufferEmittedCount: 100,
  concealedSamples: 20,
  concealmentEvents: 1,
  totalSamplesReceived: 48_000,
  insertedSamplesForDeceleration: 10,
  removedSamplesForAcceleration: 5,
};

describe("Realtime inbound audio diagnostics", () => {
  it("extracts the active inbound audio report", () => {
    const report = new Map<string, unknown>([
      ["outbound", { type: "outbound-rtp", kind: "audio", packetsSent: 40 }],
      [
        "inbound",
        {
          type: "inbound-rtp",
          kind: "audio",
          packetsReceived: 120,
          packetsLost: 2,
          jitter: 0.025,
          jitterBufferDelay: 2.5,
          jitterBufferEmittedCount: 120,
          concealedSamples: 30,
          concealmentEvents: 2,
          totalSamplesReceived: 60_000,
          insertedSamplesForDeceleration: 12,
          removedSamplesForAcceleration: 6,
        },
      ],
    ]);

    expect(inboundAudioStatsFromReport(report)).toEqual({
      packetsReceived: 120,
      packetsLost: 2,
      jitterSeconds: 0.025,
      jitterBufferDelaySeconds: 2.5,
      jitterBufferEmittedCount: 120,
      concealedSamples: 30,
      concealmentEvents: 2,
      totalSamplesReceived: 60_000,
      insertedSamplesForDeceleration: 12,
      removedSamplesForAcceleration: 6,
    });
  });

  it("reports a clean turn from cumulative counters", () => {
    expect(
      summarizeInboundAudioQuality(baseline, {
        ...baseline,
        packetsReceived: 200,
        jitterSeconds: 0.018,
        jitterBufferDelaySeconds: 4.4,
        jitterBufferEmittedCount: 200,
        totalSamplesReceived: 96_000,
        insertedSamplesForDeceleration: 14,
        removedSamplesForAcceleration: 7,
      }),
    ).toEqual({
      quality: "good",
      packetsReceived: 100,
      packetsLost: 0,
      lossPercent: 0,
      jitterMs: 18,
      meanJitterBufferMs: 24,
      concealedSamples: 0,
      concealmentEvents: 0,
      concealmentPercent: 0,
      insertedSamples: 4,
      removedSamples: 2,
    });
  });

  it("flags packet loss and concealment that can sound corrupted", () => {
    const summary = summarizeInboundAudioQuality(baseline, {
      ...baseline,
      packetsReceived: 180,
      packetsLost: 5,
      jitterSeconds: 0.071,
      concealedSamples: 2_420,
      concealmentEvents: 4,
      totalSamplesReceived: 96_000,
    });

    expect(summary.quality).toBe("degraded");
    expect(summary.packetsLost).toBe(4);
    expect(summary.lossPercent).toBe(4.76);
    expect(summary.concealmentPercent).toBe(5);
    expect(summary.jitterMs).toBe(71);
  });
});
