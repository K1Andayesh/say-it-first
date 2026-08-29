import { randomUUID } from "node:crypto";

import {
  evaluatePracticeResponseSchema,
  type PracticeEvaluation,
} from "@say-it-first/contracts";
import { describe, expect, it } from "vitest";

import { buildApp } from "./app.js";
import type { AppEnvironment } from "./config/env.js";
import type {
  EvaluationProvider,
  RealtimeProvider,
} from "./providers/provider-contracts.js";

const testEnvironment: AppEnvironment = {
  appEnv: "test",
  host: "127.0.0.1",
  port: 4100,
  logLevel: "silent",
  logPretty: false,
  corsOrigins: [],
  bodyLimitBytes: 100_000,
  openAI: {
    realtimeModel: "test-realtime",
    evaluationModel: "test-evaluation",
    realtimeVoice: "test-voice",
    requestTimeoutMs: 5_000,
  },
};

const groundedEvaluation: PracticeEvaluation = {
  schemaVersion: 1,
  summary: "You named the recurring quality gap clearly.",
  strongestMoment: {
    turnId: "user-1",
    quote: "three recent deliverables needed substantial rework",
    explanation: "This is a concrete, observable pattern.",
  },
  missedOpportunity: null,
  dimensions: [
    "clarity",
    "empathy_listening",
    "specificity",
    "boundaries_assertiveness",
    "next_steps_accountability",
  ].map((dimension) => ({
    dimension: dimension as PracticeEvaluation["dimensions"][number]["dimension"],
    score: null,
    label: "not_enough_evidence" as const,
    evidence: [],
    feedback: "The conversation is too short to assess this dimension.",
    nextTry: "Continue with one direct question.",
  })),
  suggestedOpening: null,
  suggestedNextSentence: "What got in the way, and what needs to change next time?",
  suggestedClosing: null,
  overallNextStep: "Continue the rehearsal and agree on a measurable next step.",
  cautions: [],
  evaluatorConfidence: 0.74,
};

const realtimeProvider: RealtimeProvider = {
  configured: true,
  model: "test-realtime",
  createCall: () =>
    Promise.resolve({
      answerSdp: "v=0\r\no=- 123 2 IN IP4 127.0.0.1\r\ns=test-answer\r\n",
      model: "test-realtime",
      providerRequestId: "provider-realtime-1",
      durationMs: 25,
    }),
};

const evaluationProvider: EvaluationProvider = {
  configured: true,
  model: "test-evaluation",
  evaluate: () =>
    Promise.resolve({
      evaluation: groundedEvaluation,
      model: "test-evaluation",
      providerRequestId: "provider-evaluation-1",
      durationMs: 80,
    }),
};

describe("API", () => {
  it("reports provider readiness without exposing configuration", async () => {
    const app = await buildApp(testEnvironment, { realtimeProvider, evaluationProvider });

    const response = await app.inject({ method: "GET", url: "/health/ready" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
      checks: { realtimeProvider: "ok", evaluationProvider: "ok" },
    });
    expect(response.headers["x-request-id"]).toBeTruthy();
    expect(response.headers["x-trace-id"]).toMatch(/^[a-f0-9]{32}$/);
    await app.close();
  });

  it("returns the bounded scenario catalogue", async () => {
    const app = await buildApp(testEnvironment, { realtimeProvider, evaluationProvider });

    const response = await app.inject({ method: "GET", url: "/api/v1/scenarios" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      scenarios: [{ id: "scn-underperformance-feedback", version: 1 }],
      personas: [{ id: "persona-defensive", version: 1 }],
    });
    await app.close();
  });

  it("serves production privacy, terms, and support pages without placeholder copy", async () => {
    const app = await buildApp(testEnvironment, { realtimeProvider, evaluationProvider });

    for (const path of ["/privacy", "/terms", "/support"]) {
      const response = await app.inject({ method: "GET", url: path });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("text/html");
      expect(response.headers["content-security-policy"]).toContain("default-src 'none'");
      expect(response.body).toContain("keyvan.andayesh@gmail.com");
      expect(response.body).not.toContain("will include the support contact");
    }

    await app.close();
  });

  it("proxies an SDP offer and returns correlation metadata", async () => {
    const app = await buildApp(testEnvironment, { realtimeProvider, evaluationProvider });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/realtime/calls?scenarioId=scn-underperformance-feedback&personaId=persona-defensive",
      headers: {
        "content-type": "application/sdp",
        "x-anonymous-user-id": randomUUID(),
        "x-request-id": "mobile-session-12345678",
      },
      payload: "v=0\r\no=- 456 2 IN IP4 127.0.0.1\r\ns=test-offer\r\n",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/sdp");
    expect(response.headers["x-ai-model"]).toBe("test-realtime");
    expect(response.headers["x-provider-request-id"]).toBe("provider-realtime-1");
    expect(response.headers["x-request-id"]).toBe("mobile-session-12345678");
    expect(response.body).toContain("s=test-answer");
    await app.close();
  });

  it("returns grounded structured feedback with trace metadata", async () => {
    const app = await buildApp(testEnvironment, { realtimeProvider, evaluationProvider });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/evaluations",
      payload: {
        practiceSessionId: randomUUID(),
        scenarioId: "scn-underperformance-feedback",
        scenarioVersion: 1,
        personaId: "persona-defensive",
        transcript: [
          {
            id: "user-1",
            sequence: 0,
            speaker: "user",
            text: "The last three recent deliverables needed substantial rework.",
            startedAtMs: 0,
            endedAtMs: 4_000,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      evaluation: { schemaVersion: 1, evaluatorConfidence: 0.74 },
      meta: {
        model: "test-evaluation",
        providerRequestId: "provider-evaluation-1",
      },
    });
    const responseBody = evaluatePracticeResponseSchema.parse(response.json());
    expect(responseBody.meta.traceId).toMatch(/^[a-f0-9]{32}$/);
    await app.close();
  });

  it("returns a safe validation error without echoing transcript content", async () => {
    const app = await buildApp(testEnvironment, { realtimeProvider, evaluationProvider });
    const secretText = "CONFIDENTIAL EMPLOYEE DETAIL";

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/evaluations",
      payload: { transcript: [{ text: secretText }] },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain(secretText);
    expect(response.json()).toMatchObject({
      error: { code: "bad_request", retryable: false },
    });
    await app.close();
  });
});
