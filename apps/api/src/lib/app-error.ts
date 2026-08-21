import type { ApiErrorCode } from "@say-it-first/contracts";

export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly logContext: Readonly<Record<string, unknown>>;

  public constructor(input: {
    code: ApiErrorCode;
    message: string;
    statusCode: number;
    retryable?: boolean;
    logContext?: Readonly<Record<string, unknown>>;
    cause?: unknown;
  }) {
    super(input.message, { cause: input.cause });
    this.name = "AppError";
    this.code = input.code;
    this.statusCode = input.statusCode;
    this.retryable = input.retryable ?? false;
    this.logContext = input.logContext ?? {};
  }
}
