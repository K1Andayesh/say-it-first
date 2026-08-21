import { z } from "zod";
import type { FastifyInstance } from "fastify";

import { AppError } from "../lib/app-error.js";
import type { RealtimeProvider } from "../providers/provider-contracts.js";

const querySchema = z.object({
  scenarioId: z.string().min(1).max(120),
  personaId: z.string().min(1).max(120),
});

const anonymousUserIdSchema = z.string().uuid();
const sdpSchema = z.string().min(20).max(80_000).refine((value) => value.includes("v=0"), {
  message: "Expected an SDP offer.",
});

export function registerRealtimeRoutes(
  fastify: FastifyInstance,
  dependencies: { realtimeProvider: RealtimeProvider },
): void {
  fastify.post(
    "/api/v1/realtime/calls",
    {
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const query = querySchema.parse(request.query);
      const anonymousUserId = anonymousUserIdSchema.parse(request.headers["x-anonymous-user-id"]);
      const sdp = sdpSchema.parse(request.body);

      if (request.headers["content-type"]?.split(";")[0] !== "application/sdp") {
        throw new AppError({
          code: "bad_request",
          message: "Realtime calls require an application/sdp request.",
          statusCode: 415,
        });
      }

      const result = await dependencies.realtimeProvider.createCall({
        sdp,
        scenarioId: query.scenarioId,
        personaId: query.personaId,
        anonymousUserId,
      });

      return reply
        .header("content-type", "application/sdp")
        .header("x-ai-model", result.model)
        .header("x-ai-session-duration-ms", result.durationMs)
        .header("x-provider-request-id", result.providerRequestId ?? "unavailable")
        .send(result.answerSdp);
    },
  );
}
