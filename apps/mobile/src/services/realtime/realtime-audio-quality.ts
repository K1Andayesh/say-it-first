type StatsRecord = Readonly<Record<string, unknown>>;

export type InboundAudioStatsSnapshot = {
  packetsReceived: number | null;
  packetsLost: number | null;
  jitterSeconds: number | null;
  jitterBufferDelaySeconds: number | null;
  jitterBufferEmittedCount: number | null;
  concealedSamples: number | null;
  concealmentEvents: number | null;
  totalSamplesReceived: number | null;
  insertedSamplesForDeceleration: number | null;
  removedSamplesForAcceleration: number | null;
};

export type InboundAudioQualitySummary = {
  quality: "good" | "degraded";
  packetsReceived: number | null;
  packetsLost: number | null;
  lossPercent: number | null;
  jitterMs: number | null;
  meanJitterBufferMs: number | null;
  concealedSamples: number | null;
  concealmentEvents: number | null;
  concealmentPercent: number | null;
  insertedSamples: number | null;
  removedSamples: number | null;
};

function isRecord(value: unknown): value is StatsRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function finiteNumber(record: StatsRecord, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isInboundAudio(record: StatsRecord): boolean {
  const kind = record.kind ?? record.mediaType;
  return record.type === "inbound-rtp" && kind === "audio" && record.isRemote !== true;
}

/**
 * Selects the active inbound audio RTP report without retaining media or transcript content.
 */
export function inboundAudioStatsFromReport(
  report: ReadonlyMap<string, unknown>,
): InboundAudioStatsSnapshot | null {
  let selected: StatsRecord | null = null;
  let selectedPacketCount = -1;

  report.forEach((value) => {
    if (!isRecord(value) || !isInboundAudio(value)) return;
    const packetCount = finiteNumber(value, "packetsReceived") ?? 0;
    if (packetCount < selectedPacketCount) return;
    selected = value;
    selectedPacketCount = packetCount;
  });

  if (!selected) return null;
  const stats: StatsRecord = selected;

  return {
    packetsReceived: finiteNumber(stats, "packetsReceived"),
    packetsLost: finiteNumber(stats, "packetsLost"),
    jitterSeconds: finiteNumber(stats, "jitter"),
    jitterBufferDelaySeconds: finiteNumber(stats, "jitterBufferDelay"),
    jitterBufferEmittedCount: finiteNumber(stats, "jitterBufferEmittedCount"),
    concealedSamples: finiteNumber(stats, "concealedSamples"),
    concealmentEvents: finiteNumber(stats, "concealmentEvents"),
    totalSamplesReceived: finiteNumber(stats, "totalSamplesReceived"),
    insertedSamplesForDeceleration: finiteNumber(stats, "insertedSamplesForDeceleration"),
    removedSamplesForAcceleration: finiteNumber(stats, "removedSamplesForAcceleration"),
  };
}

function nonNegativeDelta(end: number | null, start: number | null): number | null {
  if (end === null || start === null) return null;
  return Math.max(0, end - start);
}

function rounded(value: number, precision = 2): number {
  const scale = 10 ** precision;
  return Math.round(value * scale) / scale;
}

/**
 * Converts cumulative WebRTC receiver counters into one assistant-turn quality summary.
 */
export function summarizeInboundAudioQuality(
  start: InboundAudioStatsSnapshot,
  end: InboundAudioStatsSnapshot,
): InboundAudioQualitySummary {
  const packetsReceived = nonNegativeDelta(end.packetsReceived, start.packetsReceived);
  const packetsLost = nonNegativeDelta(end.packetsLost, start.packetsLost);
  const packetTotal = (packetsReceived ?? 0) + (packetsLost ?? 0);
  const lossPercent =
    packetsReceived !== null && packetsLost !== null && packetTotal > 0
      ? rounded((packetsLost / packetTotal) * 100)
      : null;

  const emittedCount = nonNegativeDelta(
    end.jitterBufferEmittedCount,
    start.jitterBufferEmittedCount,
  );
  const bufferDelay = nonNegativeDelta(
    end.jitterBufferDelaySeconds,
    start.jitterBufferDelaySeconds,
  );
  const meanJitterBufferMs =
    emittedCount !== null && bufferDelay !== null && emittedCount > 0
      ? rounded((bufferDelay / emittedCount) * 1_000)
      : null;

  const concealedSamples = nonNegativeDelta(end.concealedSamples, start.concealedSamples);
  const concealmentEvents = nonNegativeDelta(end.concealmentEvents, start.concealmentEvents);
  const totalSamples = nonNegativeDelta(end.totalSamplesReceived, start.totalSamplesReceived);
  const concealmentPercent =
    concealedSamples !== null && totalSamples !== null && totalSamples > 0
      ? rounded((concealedSamples / totalSamples) * 100)
      : null;

  const jitterMs = end.jitterSeconds === null ? null : rounded(end.jitterSeconds * 1_000);
  const insertedSamples = nonNegativeDelta(
    end.insertedSamplesForDeceleration,
    start.insertedSamplesForDeceleration,
  );
  const removedSamples = nonNegativeDelta(
    end.removedSamplesForAcceleration,
    start.removedSamplesForAcceleration,
  );

  const degraded =
    (lossPercent !== null && lossPercent >= 2) ||
    (concealmentPercent !== null && concealmentPercent >= 1) ||
    (concealmentEvents !== null && concealmentEvents >= 2) ||
    (jitterMs !== null && jitterMs >= 60);

  return {
    quality: degraded ? "degraded" : "good",
    packetsReceived,
    packetsLost,
    lossPercent,
    jitterMs,
    meanJitterBufferMs,
    concealedSamples,
    concealmentEvents,
    concealmentPercent,
    insertedSamples,
    removedSamples,
  };
}
