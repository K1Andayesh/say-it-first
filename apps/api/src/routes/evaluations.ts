import {
  evaluatePracticeRequestSchema,
  evaluatePracticeResponseSchema,
} from "@say-it-first/contracts";
import type { FastifyInstance } from "fastify";

import type { EvaluationProvider } from "../providers/provider-contracts.js";

export function registerEvaluationRoutes(
  fastify: FastifyInstance,
  dependencies: { evaluationProvider: EvaluationProvider },
): void {
  fastify.post(
    "/api/v1/evaluations",
    {
      config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
    },
    async (request) => {
      const input = evaluatePracticeRequestSchema.parse(request.body);
      const result = await dependencies.evaluationProvider.evaluate({
        scenarioId: input.scenarioId,
        scenarioVersion: input.scenarioVersion,
        personaId: input.personaId,
        transcript: input.transcript,
        ...(input.customContext ? { customContext: input.customContext } : {}),
      });

      return evaluatePracticeResponseSchema.parse({
        evaluation: result.evaluation,
        meta: {
          requestId: request.traceContext.requestId,
          traceId: request.traceContext.traceId,
          durationMs: result.durationMs,
          model: result.model,
          providerRequestId: result.providerRequestId,
        },
      });
    },
  );
}
