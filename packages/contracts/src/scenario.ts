import { z } from "zod";

export const scenarioCategorySchema = z.enum([
  "feedback",
  "boundaries",
  "saying_no",
  "accountability",
  "delegation",
]);

export const scenarioDefinitionSchema = z.object({
  id: z.string().regex(/^scn-[a-z0-9-]+$/),
  version: z.number().int().positive(),
  title: z.string().min(1).max(80),
  shortDescription: z.string().min(1).max(180),
  category: scenarioCategorySchema,
  difficulty: z.enum(["starter", "intermediate", "advanced"]),
  context: z.string().min(1).max(2_000),
  userRole: z.string().min(1).max(500),
  employeeRole: z.string().min(1).max(500),
  userGoal: z.string().min(1).max(1_000),
  hiddenEmployeeGoal: z.string().min(1).max(1_000),
  facts: z.array(z.string().min(1).max(500)).min(1).max(20),
  ambiguity: z.array(z.string().min(1).max(500)).max(20),
  successSignals: z.array(z.string().min(1).max(500)).min(1).max(20),
  failurePatterns: z.array(z.string().min(1).max(500)).min(1).max(20),
  prohibitedEscalations: z.array(z.string().min(1).max(500)).max(20),
  recommendedDurationSeconds: z.number().int().min(60).max(360),
});

export type ScenarioCategory = z.infer<typeof scenarioCategorySchema>;
export type ScenarioDefinition = z.infer<typeof scenarioDefinitionSchema>;

export const employeePersonaSchema = z.object({
  id: z.string().regex(/^persona-[a-z0-9-]+$/),
  version: z.number().int().positive(),
  title: z.string().min(1).max(60),
  shortDescription: z.string().min(1).max(180),
  behaviour: z.array(z.string().min(1).max(500)).min(1).max(20),
  respondsBetterTo: z.array(z.string().min(1).max(300)).min(1).max(10),
});

export type EmployeePersona = z.infer<typeof employeePersonaSchema>;

export const scenarioSummarySchema = scenarioDefinitionSchema.pick({
  id: true,
  version: true,
  title: true,
  shortDescription: true,
  category: true,
  difficulty: true,
  recommendedDurationSeconds: true,
});

export type ScenarioSummary = z.infer<typeof scenarioSummarySchema>;
