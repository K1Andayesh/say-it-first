import { createHash, randomUUID } from "node:crypto";

import { createContentReportRequestSchema } from "@say-it-first/contracts";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

const anonymousUserIdSchema = z.string().uuid();

export function registerContentReportRoutes(fastify: FastifyInstance): void {
  fastify.post(
    "/api/v1/content-reports",
    {
      config: { rateLimit: { max: 6, timeWindow: "1 hour" } },
    },
    async (request, reply) => {
      const anonymousUserId = anonymousUserIdSchema.parse(
        request.headers["x-anonymous-user-id"],
      );
      const report = createContentReportRequestSchema.parse(request.body);
      const reportId = randomUUID();
      const anonymousUserHash = createHash("sha256").update(anonymousUserId).digest("hex");

      // This is an explicit, user-initiated safety report rather than routine diagnostics.
      // The reported AI reply is retained in Cloud Logging for 30 days so reports can
      // inform prompt safeguards and moderation without collecting the user's transcript.
      request.log.warn(
        {
          event: "ai.content.reported",
          reportId,
          anonymousUserHash,
          scenarioId: report.scenarioId,
          personaId: report.personaId,
          assistantTurnId: report.assistantTurnId,
          reason: report.reason,
          reportedAssistantText: report.assistantText,
          retentionDays: 30,
        },
        "user reported AI-generated content",
      );

      return reply.status(202).send({
        reportId,
        accepted: true,
        meta: {
          requestId: request.traceContext.requestId,
          traceId: request.traceContext.traceId,
        },
      });
    },
  );
}
