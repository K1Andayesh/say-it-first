# Architecture

## Checkpoint 1 topology

```text
Android development build
  -> HTTPS/SDP -> Fastify API
      -> OpenAI Realtime unified WebRTC session endpoint
  <- SDP answer <-

Android data channel
  <-> Realtime lifecycle and transcript events

Android transcript
  -> HTTPS/JSON -> Fastify evaluation endpoint
      -> OpenAI Responses structured output
      -> server-side schema and exact-quote validation
  <- grounded evaluation <-
```

## Boundaries

- Mobile owns microphone permission, peer connection, visible session state, and local transcript.
- API owns session configuration, prompts, safety identifier, provider credentials, evaluation,
  validation, rate limits, and operational telemetry.
- Shared contracts own every network and persisted boundary.
- Domain code owns scenario definitions, prompts, state transitions, and evidence grounding.
- UI code cannot call OpenAI directly.

## Observability

Every API request has a request ID and W3C-shaped trace ID. Responses return both identifiers.
Provider operations log only operational metadata: model, duration, counts, status, error class,
and provider request ID. Sensitive content is explicitly redacted and never placed in routine logs.

The mobile diagnostic trail stores a bounded in-memory list of state changes and timing events. It
does not store audio, transcript text, authorization headers, or SDP content.
