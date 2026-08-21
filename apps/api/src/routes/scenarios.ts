import { scenarioSummarySchema } from "@say-it-first/contracts";
import { personas, scenarios } from "@say-it-first/domain";
import type { FastifyInstance } from "fastify";

export function registerScenarioRoutes(fastify: FastifyInstance): void {
  fastify.get("/api/v1/scenarios", () => ({
    scenarios: scenarios.map((scenario) => scenarioSummarySchema.parse(scenario)),
    personas: personas.map(({ id, version, title, shortDescription }) => ({
      id,
      version,
      title,
      shortDescription,
    })),
  }));
}
