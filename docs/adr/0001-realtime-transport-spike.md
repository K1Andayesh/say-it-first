# ADR 0001 — Realtime transport

- Status: proposed; physical-device evidence pending
- Date: 2026-08-20

## Context

The product requires a natural three-to-five-minute voice rehearsal on Android. The standard AI
credential must remain server-side, transcript events must be available for evaluation, and an
abandoned session must not continue consuming resources.

## Provisional decision

Spike the OpenAI Realtime unified WebRTC interface through a Fastify session endpoint. The mobile
client posts its SDP offer to the trusted API; the API supplies server-controlled session
instructions and authenticates the provider request. The mobile client handles the peer connection,
audio media, data-channel events, transcript, and explicit teardown.

This follows current official OpenAI guidance recommending WebRTC for client/mobile Realtime
connections and keeps the standard API key on the backend.

## Exit evidence required

- Median end-of-utterance to first audible response at or below 1.5 seconds
- P95 at or below 2.5 seconds
- Stable five-minute physical-device session
- Clean teardown after end, timeout, backgrounding, and interruption
- Transcript events adequate for exact evidence grounding
- Measured cost per representative practice

## Evidence collected so far

- Native Android debug build completed and installed on a Pixel 9 emulator.
- Native Android debug build completed, installed, and exercised on a Pixel 10 Pro XL physical
  device running Android 17/API 37.
- Landing, microphone permission, connecting, and API-unavailable recovery states were exercised
  through the actual Android UI.
- An explicit 12-second mobile session-negotiation deadline returns the user to a retryable state;
  audio tracks and the peer connection are closed on failure.
- The emulator returned to recovery in about 12.2 seconds with no API listener, and about 0.2
  seconds when the API deliberately reported missing provider configuration.
- Mobile request and W3C trace identifiers were observed unchanged in the corresponding API log;
  audio, SDP, transcript text, custom context, and credentials were absent from the event payloads.
- Static checks, API integration tests, domain tests, Android bundle export, and native compilation
  pass.
- The initial physical run exposed three production-relevant failure modes: assistant echo could
  trigger server VAD, Android audio focus/output routing was not explicitly owned, and a
  `max_output_tokens: 280` session setting ended longer audio mid-sentence.
- The client now gates microphone capture during assistant output, owns Android communication audio
  focus and speaker routing, and restores the route on teardown. The server uses the supported
  unbounded Realtime response setting while the prompt—not a transport token ceiling—controls
  brevity.
- In the corrected six-turn physical rehearsal, all six assistant responses completed normally,
  each exceeded the old 280-unit ceiling, and there were no output-buffer clears or protocol
  truncations.
- The corrected six-turn latency sample was 524-695 ms, with an observed median of 628 ms. This is
  encouraging preliminary evidence, not a statistically defensible P95.
- The transcript reached grounded evaluation with all 12 turns, evaluator confidence 0.98, and a
  clean completed UI state.
- A later uninterrupted 5m17s physical-device rehearsal produced 29 transcript turns, clean
  teardown, and grounded evaluation with confidence 0.97. One assistant reply nevertheless had
  transient audible corruption, so duration alone did not close the stability criterion.
- The client now samples inbound WebRTC RTP counters around every assistant turn and records only
  packet, jitter-buffer, and audio-concealment metrics. It does not record audio or transcript
  content in this telemetry.
- A controlled follow-up exercised short, approximately 30-second, and approximately 50-second
  replies with explicit spoken completion markers. The product owner heard all three replies finish
  without cutout, silence, distortion, skipping, or repetition.
- The controlled baseline and long replies were classified `good`. The baseline received 525
  packets and the long reply received 1,805; both reported zero packet loss, 1 ms jitter, and zero
  concealed samples or concealment events.

The five-minute duration target and a controlled long-reply retest have now been demonstrated, but
the five-minute run's isolated audible corruption keeps the stable-session criterion open.
Physical-device lifecycle/interruption checks, broader network-condition coverage, a larger latency
sample, and measured representative practice cost also remain unresolved. The ADR stays proposed
until those explicit exit conditions pass.

## Fallback

If the targets are not repeatable, select the documented turn-based record/transcribe/respond/play
pipeline without changing domain or evaluation contracts.
