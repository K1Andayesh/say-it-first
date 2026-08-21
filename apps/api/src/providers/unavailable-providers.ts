import { AppError } from "../lib/app-error.js";
import type {
  EvaluationInput,
  EvaluationProvider,
  EvaluationResult,
  RealtimeCallInput,
  RealtimeCallResult,
  RealtimeProvider,
} from "./provider-contracts.js";

export class UnavailableRealtimeProvider implements RealtimeProvider {
  public readonly configured = false;

  public constructor(public readonly model: string) {}

  public createCall(_input: RealtimeCallInput): Promise<RealtimeCallResult> {
    return Promise.reject(
      new AppError({
        code: "configuration_error",
        message: "Realtime voice is not configured on this environment.",
        statusCode: 503,
        retryable: false,
        logContext: { missingConfiguration: "OPENAI_API_KEY" },
      }),
    );
  }
}

export class UnavailableEvaluationProvider implements EvaluationProvider {
  public readonly configured = false;

  public constructor(public readonly model: string) {}

  public evaluate(_input: EvaluationInput): Promise<EvaluationResult> {
    return Promise.reject(
      new AppError({
        code: "configuration_error",
        message: "Practice evaluation is not configured on this environment.",
        statusCode: 503,
        retryable: false,
        logContext: { missingConfiguration: "OPENAI_API_KEY" },
      }),
    );
  }
}
