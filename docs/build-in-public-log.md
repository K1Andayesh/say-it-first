# Build in Public Log

Only evidence-backed entries belong here. Never publish transcripts, confidential workplace
context, credentials, private console identifiers, or fabricated metrics.

## 2026-08-20 — The first risk is voice, not screens

### Hypothesis

A winning manager-rehearsal app depends on a fast, stable spoken exchange and feedback grounded in
the manager's actual words. Visual breadth cannot compensate for a weak conversation loop.

### What we built or tested

Started with a 48-hour technical gate around Android WebRTC, live transcript capture, clean session
termination, structured evaluation, and safe tracing.

### Evidence

Pending physical-device measurement.

### Feedback

The product owner required winning-level design, precise implementation, and deep diagnostics so
the team does not spend the schedule rebuilding foundations.

### Decision

Establish production-shaped boundaries and observability during the spike, while deliberately
deferring the complete screen set and monetisation until the voice path is proven.

### Public links

- Pending

## 2026-08-20 — A clean protocol trace can still hide an audible failure

### Hypothesis

If Realtime events and WebRTC remain connected, assistant speech should finish normally on the
phone.

### What we built or tested

Ran the real voice experience on a Pixel 10 Pro XL. The first attempts exposed assistant echo/VAD
interruption and Android route ownership problems. After repairing both, longer replies still ended
at a repeatable point even though transport traces looked healthy.

### Evidence

The remaining cutoff aligned with a 280-output-token Realtime session limit. Removing that ceiling
produced six consecutive completed assistant replies of 335-500 output units, with no protocol
truncation or output-buffer clear. Observed response latency was 524-695 ms across the six-turn
sample. An uninterrupted five-minute audible test remains the release gate.

### Feedback

The product owner repeatedly reported that Alex stopped mid-sentence. That human audible signal
prevented us from treating healthy transport logs as a pass.

### Decision

Keep human-perceived completion as a release criterion, log provider completion reasons and usage,
own the native Android audio session explicitly, and control conversational brevity in the prompt
instead of imposing a transport-level output ceiling.

### Public links

- Pending
