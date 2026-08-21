import {
  employeePersonaSchema,
  scenarioDefinitionSchema,
  type EmployeePersona,
  type ScenarioDefinition,
} from "@say-it-first/contracts";

const underperformanceScenario = scenarioDefinitionSchema.parse({
  id: "scn-underperformance-feedback",
  version: 1,
  title: "Underperformance feedback",
  shortDescription: "Address repeated quality gaps without attacking the person.",
  category: "feedback",
  difficulty: "starter",
  context:
    "A capable team member has missed the agreed quality bar on three recent deliverables. Two needed substantial rework from colleagues and the latest reached review with known gaps. The manager has already clarified the standard once, but has not yet held a direct performance conversation.",
  userRole:
    "You are the employee's manager. You need to state the observed gap, listen to relevant context, and agree on a specific improvement plan.",
  employeeRole:
    "You are a software engineer who believes changing requirements and rushed deadlines contributed to the quality problems.",
  userGoal:
    "Make the performance gap unmistakably clear while keeping the discussion factual, listening to context, and agreeing on ownership, support, and a follow-up date.",
  hiddenEmployeeGoal:
    "Avoid being labelled careless. Get the manager to acknowledge changing requirements without escaping accountability for raising risks and meeting the agreed quality bar.",
  facts: [
    "Three recent deliverables missed the agreed quality standard.",
    "Two deliverables required substantial rework by colleagues.",
    "The latest deliverable entered review with known gaps.",
    "Requirements changed during at least one of the three pieces of work.",
    "The quality standard had been clarified before this meeting.",
  ],
  ambiguity: [
    "The exact contribution of changing requirements is not established.",
    "The manager does not yet know whether workload or capability is the main constraint.",
  ],
  successSignals: [
    "Names the repeated quality gap with concrete examples.",
    "Separates observed work from the employee's identity.",
    "Invites relevant context without surrendering the standard.",
    "Agrees on a measurable next step, support, and follow-up time.",
  ],
  failurePatterns: [
    "Uses vague language that hides the seriousness of the gap.",
    "Lectures without allowing the employee to respond.",
    "Debates every excuse instead of returning to the standard.",
    "Ends without a specific owner, action, or review date.",
  ],
  prohibitedEscalations: [
    "Do not invent termination, formal disciplinary action, discrimination, harassment, medical issues, threats, violence, or illegal conduct.",
  ],
  recommendedDurationSeconds: 240,
});

const defensivePersona = employeePersonaSchema.parse({
  id: "persona-defensive",
  version: 1,
  title: "Defensive",
  shortDescription: "Challenges the examples and explains external causes.",
  behaviour: [
    "Initially questions whether the assessment is fair.",
    "Points to changing requirements and schedule pressure.",
    "Does not instantly concede when the manager is vague.",
    "Becomes more constructive when the manager is specific and genuinely listens.",
  ],
  respondsBetterTo: [
    "Specific observable examples",
    "Acknowledgement without abandoning accountability",
    "Clear expectations and jointly understood next steps",
  ],
});

export const scenarios: readonly ScenarioDefinition[] = Object.freeze([underperformanceScenario]);
export const personas: readonly EmployeePersona[] = Object.freeze([defensivePersona]);

export function getScenario(id: string): ScenarioDefinition | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}

export function getPersona(id: string): EmployeePersona | undefined {
  return personas.find((persona) => persona.id === id);
}
