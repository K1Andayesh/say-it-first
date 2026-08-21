import "dotenv/config";

import { buildApp } from "./app.js";
import { readEnvironment } from "./config/env.js";

const environment = readEnvironment();
const app = await buildApp(environment);

const shutdown = async (signal: string) => {
  app.log.info({ event: "process.shutdown.requested", signal }, "shutdown requested");
  await app.close();
  app.log.info({ event: "process.shutdown.completed", signal }, "shutdown complete");
};

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

try {
  await app.listen({ host: environment.host, port: environment.port });
  app.log.info(
    {
      event: "process.started",
      host: environment.host,
      port: environment.port,
      realtimeModel: environment.openAI.realtimeModel,
      evaluationModel: environment.openAI.evaluationModel,
      openAIConfigured: Boolean(environment.openAI.apiKey),
    },
    "API listening",
  );
} catch (error) {
  app.log.fatal({ event: "process.startup.failed", err: error }, "API failed to start");
  process.exitCode = 1;
}
