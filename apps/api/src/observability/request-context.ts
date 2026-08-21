import { AsyncLocalStorage } from "node:async_hooks";

import type { TraceContext } from "./trace-context.js";

const storage = new AsyncLocalStorage<TraceContext>();

export function runWithRequestContext<T>(context: TraceContext, callback: () => T): T {
  return storage.run(context, callback);
}

export function getRequestContext(): TraceContext {
  const context = storage.getStore();
  if (!context) {
    throw new Error("Request context is unavailable outside the request lifecycle.");
  }
  return context;
}
