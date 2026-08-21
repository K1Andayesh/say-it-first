import { randomBytes, randomUUID } from "node:crypto";

const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;
const traceParentPattern = /^00-([a-f0-9]{32})-([a-f0-9]{16})-([a-f0-9]{2})$/;

export type TraceContext = {
  requestId: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  traceFlags: string;
};

function randomHex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

export function createRequestId(candidate: string | string[] | undefined): string {
  const value = Array.isArray(candidate) ? candidate[0] : candidate;
  return value && requestIdPattern.test(value) ? value : randomUUID();
}

export function createTraceContext(
  traceParent: string | string[] | undefined,
  requestId: string,
): TraceContext {
  const value = Array.isArray(traceParent) ? traceParent[0] : traceParent;
  const match = value?.match(traceParentPattern);

  if (match && match[1] !== "00000000000000000000000000000000") {
    return {
      requestId,
      traceId: match[1]!,
      spanId: randomHex(8),
      parentSpanId: match[2]!,
      traceFlags: match[3]!,
    };
  }

  return {
    requestId,
    traceId: randomHex(16),
    spanId: randomHex(8),
    traceFlags: "01",
  };
}

export function formatTraceParent(context: TraceContext): string {
  return `00-${context.traceId}-${context.spanId}-${context.traceFlags}`;
}
