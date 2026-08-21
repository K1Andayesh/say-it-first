import type { FastifyInstance } from "fastify";

import { runWithRequestContext } from "./request-context.js";
import {
  createRequestId,
  createTraceContext,
  formatTraceParent,
  type TraceContext,
} from "./trace-context.js";

declare module "fastify" {
  interface FastifyRequest {
    traceContext: TraceContext;
  }
}

export function registerObservability(fastify: FastifyInstance): void {
  fastify.addHook("onRequest", (request, reply, done) => {
    const requestId = createRequestId(request.headers["x-request-id"]);
    const context = createTraceContext(request.headers.traceparent, requestId);
    request.traceContext = context;

    reply.header("x-request-id", context.requestId);
    reply.header("x-trace-id", context.traceId);
    reply.header("traceparent", formatTraceParent(context));

    runWithRequestContext(context, () => {
      request.log = request.log.child({
        requestId: context.requestId,
        traceId: context.traceId,
        spanId: context.spanId,
        ...(context.parentSpanId ? { parentSpanId: context.parentSpanId } : {}),
      });
      request.log.info(
        { event: "http.request.started", method: request.method, path: request.url.split("?")[0] },
        "request started",
      );
      done();
    });
  });

  fastify.addHook("onResponse", (request, reply, done) => {
    request.log.info(
      {
        event: "http.request.completed",
        method: request.method,
        path: request.url.split("?")[0],
        statusCode: reply.statusCode,
        durationMs: Math.round(reply.elapsedTime),
      },
      "request completed",
    );
    done();
  });
}
