import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import type { ApiErrorCode } from "@say-it-first/contracts";
import Fastify, { type FastifyInstance, LogController } from "fastify";
import { ZodError } from "zod";

import type { AppEnvironment } from "./config/env.js";
import { AppError } from "./lib/app-error.js";
import { createLoggerOptions } from "./observability/logger.js";
import { registerObservability } from "./observability/plugin.js";
import {
  OpenAIEvaluationProvider,
} from "./providers/openai-evaluation-provider.js";
import { OpenAIRealtimeProvider } from "./providers/openai-realtime-provider.js";
import type { EvaluationProvider, RealtimeProvider } from "./providers/provider-contracts.js";
import {
  UnavailableEvaluationProvider,
  UnavailableRealtimeProvider,
} from "./providers/unavailable-providers.js";
import { registerEvaluationRoutes } from "./routes/evaluations.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerRealtimeRoutes } from "./routes/realtime.js";
import { registerScenarioRoutes } from "./routes/scenarios.js";

export type AppDependencies = {
  realtimeProvider?: RealtimeProvider;
  evaluationProvider?: EvaluationProvider;
};

function publicError(input: {
  code: ApiErrorCode;
  message: string;
  retryable: boolean;
  requestId: string;
  traceId: string;
}) {
  return { error: input };
}

export async function buildApp(
  environment: AppEnvironment,
  dependencies: AppDependencies = {},
): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: createLoggerOptions(environment),
    bodyLimit: environment.bodyLimitBytes,
    logController: new LogController({ disableRequestLogging: true }),
    genReqId: (request) => {
      const candidate = request.headers["x-request-id"];
      return Array.isArray(candidate) ? (candidate[0] ?? crypto.randomUUID()) : (candidate ?? crypto.randomUUID());
    },
    trustProxy: environment.appEnv === "production",
  });

  fastify.addContentTypeParser(
    "application/sdp",
    { parseAs: "string", bodyLimit: 80_000 },
    (_request, body, done) => done(null, body),
  );

  registerObservability(fastify);
  await fastify.register(rateLimit, {
    global: true,
    max: 120,
    timeWindow: "1 minute",
    keyGenerator: (request) =>
      String(request.headers["x-anonymous-user-id"] ?? request.ip).slice(0, 128),
  });

  if (environment.corsOrigins.length > 0) {
    await fastify.register(cors, {
      origin: environment.corsOrigins,
      methods: ["GET", "POST", "DELETE"],
      allowedHeaders: [
        "content-type",
        "authorization",
        "x-anonymous-user-id",
        "x-request-id",
        "traceparent",
      ],
      exposedHeaders: ["x-request-id", "x-trace-id", "traceparent"],
    });
  }

  const realtimeProvider =
    dependencies.realtimeProvider ??
    (environment.openAI.apiKey && environment.openAI.safetyHashSalt
      ? new OpenAIRealtimeProvider({
          apiKey: environment.openAI.apiKey,
          model: environment.openAI.realtimeModel,
          voice: environment.openAI.realtimeVoice,
          safetyHashSalt: environment.openAI.safetyHashSalt,
          timeoutMs: environment.openAI.requestTimeoutMs,
          logger: fastify.log,
        })
      : new UnavailableRealtimeProvider(environment.openAI.realtimeModel));

  const evaluationProvider =
    dependencies.evaluationProvider ??
    (environment.openAI.apiKey
      ? new OpenAIEvaluationProvider({
          apiKey: environment.openAI.apiKey,
          model: environment.openAI.evaluationModel,
          timeoutMs: environment.openAI.requestTimeoutMs,
          logger: fastify.log,
        })
      : new UnavailableEvaluationProvider(environment.openAI.evaluationModel));

  registerHealthRoutes(fastify, { realtimeProvider, evaluationProvider });
  registerScenarioRoutes(fastify);
  registerRealtimeRoutes(fastify, { realtimeProvider });
  registerEvaluationRoutes(fastify, { evaluationProvider });

  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send(
      publicError({
        code: "not_found",
        message: "The requested endpoint does not exist.",
        retryable: false,
        requestId: request.traceContext.requestId,
        traceId: request.traceContext.traceId,
      }),
    );
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    const context = request.traceContext;
    const appError =
      error instanceof AppError
        ? error
        : error instanceof ZodError
          ? new AppError({
              code: "bad_request",
              message: "The request did not match the required format.",
              statusCode: 400,
              retryable: false,
              logContext: {
                issueCount: error.issues.length,
                issuePaths: error.issues.map((issue) => issue.path.join(".")).filter(Boolean),
              },
              cause: error,
            })
          : new AppError({
              code: "internal_error",
              message: "An unexpected error occurred. Please try again.",
              statusCode: 500,
              retryable: true,
              cause: error,
            });

    request.log.error(
      {
        event: "http.request.failed",
        requestId: context.requestId,
        traceId: context.traceId,
        code: appError.code,
        statusCode: appError.statusCode,
        retryable: appError.retryable,
        ...appError.logContext,
        err: appError,
      },
      "request failed",
    );

    return reply.status(appError.statusCode).send(
      publicError({
        code: appError.code,
        message: appError.message,
        retryable: appError.retryable,
        requestId: context.requestId,
        traceId: context.traceId,
      }),
    );
  });

  await fastify.ready();
  return fastify;
}
