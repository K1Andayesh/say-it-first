export type DiagnosticLevel = "debug" | "info" | "warn" | "error";

export type DiagnosticEntry = {
  sequence: number;
  timestamp: string;
  level: DiagnosticLevel;
  event: string;
  metadata: Readonly<Record<string, string | number | boolean | null>>;
};

const sensitiveKeyPattern = /audio|authorization|context|cookie|key|sdp|secret|token|transcript/i;
const maximumEntries = 250;

class DiagnosticLog {
  private entries: DiagnosticEntry[] = [];
  private sequence = 0;

  public record(
    level: DiagnosticLevel,
    event: string,
    metadata: Readonly<Record<string, string | number | boolean | null>> = {},
  ): void {
    const safeMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([key]) => !sensitiveKeyPattern.test(key)),
    );

    this.sequence += 1;
    this.entries.push({
      sequence: this.sequence,
      timestamp: new Date().toISOString(),
      level,
      event,
      metadata: safeMetadata,
    });
    if (this.entries.length > maximumEntries) this.entries = this.entries.slice(-maximumEntries);

    if (__DEV__) {
      // React Native turns console.error/console.warn into user-facing development overlays.
      // Preserve severity as structured data without obscuring the UI under test.
      console.info("[diagnostic]", { level, event, ...safeMetadata });
    }
  }

  public snapshot(): readonly DiagnosticEntry[] {
    return [...this.entries];
  }

  public clear(): void {
    this.entries = [];
  }
}

export const diagnosticLog = new DiagnosticLog();
