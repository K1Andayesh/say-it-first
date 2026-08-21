import type { FastifyInstance } from "fastify";

import type { EvaluationProvider, RealtimeProvider } from "../providers/provider-contracts.js";

export function registerHealthRoutes(
  fastify: FastifyInstance,
  dependencies: { realtimeProvider: RealtimeProvider; evaluationProvider: EvaluationProvider },
): void {
  fastify.get("/health/live", () => ({
    status: "ok" as const,
    service: "say-it-first-api" as const,
    version: process.env.npm_package_version ?? "0.1.0",
  }));

  fastify.get("/health/ready", (_request, reply) => {
    const checks = {
      realtimeProvider: dependencies.realtimeProvider.configured ? ("ok" as const) : ("missing" as const),
      evaluationProvider: dependencies.evaluationProvider.configured
        ? ("ok" as const)
        : ("missing" as const),
    };
    const ready = Object.values(checks).every((check) => check === "ok");

    return reply.status(ready ? 200 : 503).send({
      status: ready ? ("ok" as const) : ("degraded" as const),
      service: "say-it-first-api" as const,
      version: process.env.npm_package_version ?? "0.1.0",
      checks,
    });
  });
}
