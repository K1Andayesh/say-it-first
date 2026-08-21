import { z } from "zod";

const environmentSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_HOST: z.string().min(1).default("0.0.0.0"),
  API_PORT: z.coerce.number().int().min(1).max(65_535).default(4100),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  LOG_PRETTY: z.stringbool().default(false),
  CORS_ORIGINS: z.string().default(""),
  REQUEST_BODY_LIMIT_BYTES: z.coerce.number().int().min(10_000).max(1_000_000).default(100_000),
  OPENAI_API_KEY: z.string().min(20).optional(),
  AI_REALTIME_MODEL: z.string().min(1).default("gpt-realtime-2.1"),
  AI_EVALUATION_MODEL: z.string().min(1).default("gpt-5.6-terra"),
  AI_REALTIME_VOICE: z.string().min(1).default("marin"),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(30_000),
  SAFETY_HASH_SALT: z.string().min(16).optional(),
});

export type AppEnvironment = {
  appEnv: "development" | "test" | "production";
  host: string;
  port: number;
  logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
  logPretty: boolean;
  corsOrigins: string[];
  bodyLimitBytes: number;
  openAI: {
    apiKey?: string;
    realtimeModel: string;
    evaluationModel: string;
    realtimeVoice: string;
    requestTimeoutMs: number;
    safetyHashSalt?: string;
  };
};

export function readEnvironment(source: NodeJS.ProcessEnv = process.env): AppEnvironment {
  const parsed = environmentSchema.parse(source);

  return {
    appEnv: parsed.APP_ENV,
    host: parsed.API_HOST,
    port: parsed.API_PORT,
    logLevel: parsed.LOG_LEVEL,
    logPretty: parsed.LOG_PRETTY,
    corsOrigins: parsed.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    bodyLimitBytes: parsed.REQUEST_BODY_LIMIT_BYTES,
    openAI: {
      ...(parsed.OPENAI_API_KEY ? { apiKey: parsed.OPENAI_API_KEY } : {}),
      realtimeModel: parsed.AI_REALTIME_MODEL,
      evaluationModel: parsed.AI_EVALUATION_MODEL,
      realtimeVoice: parsed.AI_REALTIME_VOICE,
      requestTimeoutMs: parsed.AI_REQUEST_TIMEOUT_MS,
      ...(parsed.SAFETY_HASH_SALT ? { safetyHashSalt: parsed.SAFETY_HASH_SALT } : {}),
    },
  };
}
