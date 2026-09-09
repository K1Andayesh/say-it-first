import { describe, expect, it } from "vitest";

import { personas, scenarios } from "./catalogue.js";
import { buildRoleplayInstructions } from "./prompts.js";

describe("buildRoleplayInstructions", () => {
  it("pins the employee identity to Alex and starts inside the conversation", () => {
    const instructions = buildRoleplayInstructions({
      scenario: scenarios[0]!,
      persona: personas[0]!,
    });

    expect(instructions).toContain("Your name is Alex");
    expect(instructions).toContain("use only Alex");
    expect(instructions).toContain("conversation as already underway");
  });
});
