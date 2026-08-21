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

## 2026-08-21 — Measure what the listener actually receives

### Hypothesis

Provider completion events cannot distinguish a fully rendered reply from packet loss, jitter, or
decoder concealment on the phone.

### What we built or tested

Added privacy-safe per-turn inbound WebRTC diagnostics for received and lost packets, jitter,
jitter-buffer delay, concealed samples, concealment events, and timing adjustments. Then ran a
controlled physical-device test with short, approximately 30-second, and approximately 50-second
assistant replies, each ending with an explicit spoken completion marker.

### Evidence

The product owner heard all three markers without cutout, silence, distortion, skipping, or
repetition. The baseline received 525 packets and the long reply received 1,805 packets; both had
zero packet loss, 1 ms jitter, and zero concealed samples or concealment events. The long reply's
mean jitter-buffer delay was 79.91 ms. No audio or transcript content was added to telemetry.

### Feedback

An earlier 5m17s rehearsal completed at the protocol level but contained one transient audible
corruption. That result remains part of the evidence and prevents a premature claim that playback
is permanently resolved.

### Decision

Retain human audible-completion checks and per-turn receiver metrics together. A future corruption
can now be separated into network delivery, decoder concealment, provider completion, and native
audio-route evidence without retaining sensitive conversation content.

### Public links

- Pending

## 2026-08-21 — Pro must unlock in the app, not just succeed in a dashboard

### Hypothesis

A polished paywall is only credible if a store-backed package activates the exact entitlement the
runtime checks, survives restore, and can be managed by the customer.

### What we built or tested

Integrated the RevenueCat React Native SDK, a contextual custom paywall, dynamic Monthly and Annual
packages, truthful calculated savings, explicit restore, Customer Center, release-key safeguards,
and privacy-safe billing diagnostics. Created the Say It First RevenueCat project and production
Android app configuration, then exercised the full Test Store flow in the Android UI.

### Evidence

The native build passed. RevenueCat returned two live packages. A valid simulated Annual purchase
activated `Pro`, the app displayed the unlocked state, restore retained access, Customer Center
showed the subscription, and the RevenueCat dashboard recorded the matching sandbox transaction.
During testing, the dashboard-created entitlement identifier was found to be case-sensitive `Pro`;
the runtime contract and regression test were corrected before acceptance.

### Feedback

The competition requires RevenueCat to power a real in-app purchase. A Test Store success proves
the integration but does not satisfy that release requirement.

### Decision

Keep Test Store and production credentials separated, reject Test Store keys in production, and do
not claim Shipaton purchase compliance until a Google Play-distributed build activates the same
entitlement. Google Play identity review is the current external blocker.

### Public links

- Pending
