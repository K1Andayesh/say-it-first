import type { LoggerOptions } from "pino";

import type { AppEnvironment } from "../config/env.js";

const redactionPaths = [
  "req.headers.authorization",
  "req.headers.cookie",
  "req.body",
  "res.headers.set-cookie",
  "headers.authorization",
  "headers.cookie",
  "authorization",
  "apiKey",
  "token",
  "accessToken",
  "refreshToken",
  "sdp",
  "audio",
  "transcript",
  "customContext",
  "*.authorization",
  "*.apiKey",
  "*.token",
  "*.sdp",
  "*.audio",
  "*.transcript",
  "*.customContext",
];

export function createLoggerOptions(environment: AppEnvironment): LoggerOptions {
  return {
    level: environment.logLevel,
    base: {
      service: "say-it-first-api",
      environment: environment.appEnv,
      version: process.env.npm_package_version ?? "0.1.0",
    },
    redact: {
      paths: redactionPaths,
      censor: "[REDACTED]",
    },
    serializers: {
      err(error: Error) {
        return {
          type: error.name,
          message: error.message,
          ...(environment.appEnv !== "production" && error.stack ? { stack: error.stack } : {}),
        };
      },
    },
    ...(environment.logPretty && environment.appEnv !== "production"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              singleLine: true,
              translateTime: "SYS:standard",
            },
          },
        }
      : {}),
  };
}
