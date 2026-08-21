# Shipaton Compliance Evidence

Status: active during Phase 1, Checkpoint 1. Official rules rechecked 2026-08-20.

Authoritative competition sources:

- https://revenuecat-shipaton-2026.devpost.com/rules
- https://revenuecat-shipaton-2026.devpost.com/

Target category: **Influencer Award — Career Coaching: Leadership Heather**.

Compatible secondary targets: HAMM, RevenueCat Design, #BuildInPublic, OneSignal Keep Them Coming
Back, and Grand Prize. Entering the Career Coaching category must not use the influencer's name,
likeness, image, voice, brand, logo, or identifying features in the product or marketing without
written consent.

## Eligibility

- First public release: pending
- Google Play URL: pending
- United States availability: pending
- RevenueCat production purchase: pending
- Judge access: pending
- English text description: pending
- Public demo video shorter than two minutes: pending
- 1024 x 1024 icon: pending
- 1179 x 2556 frameless screenshot: pending
- Category-specific submission copy: pending

## Play production access

- Account type: human input required
- Account creation date: human input required
- Verification status: human input required
- Existing production access: human input required
- Closed-test requirement applies: unknown

## Technical evidence

- Physical-device realtime test: a 5m17s Pixel 10 Pro XL rehearsal completed with 29 transcript
  turns, clean WebRTC teardown, and grounded evaluation, but one assistant reply had transient
  audible corruption; the stable-session gate therefore remains open
- Controlled audible retest: short, approximately 30-second, and approximately 50-second assistant
  replies all reached their spoken completion markers without cutting out, skipping, distortion,
  silence, or repetition
- Per-turn WebRTC receiver evidence: the baseline and long controlled replies were classified
  `good`; the baseline received 525 packets and the long reply received 1,805 packets, both with
  zero packet loss, 1 ms reported jitter, and zero concealed samples or concealment events
- OpenAI project/API configuration: available in ignored local runtime configuration; no provider
  secret is present in the mobile bundle
- Corrected rehearsal evidence: six user turns and six assistant replies; all assistant responses
  completed normally, each exceeded the removed 280-unit ceiling, and no provider truncation or
  output-buffer clear occurred
- Observed corrected turn-latency sample: 524-695 ms, median 628 ms across six turns; sample is too
  small to claim a release P95
- Android audio evidence: app received audio focus, selected communication mode and loudspeaker,
  and restored the audio session on teardown
- Grounded evaluation: 12-turn transcript accepted, exact-quote validation completed, evaluator
  confidence 0.98, and the mobile reached the completed state
- Standard provider secret absent from mobile bundle: architecture enforced; build audit pending
- Automated verification: API lint/typecheck/test/build and mobile lint/typecheck/test passed after
  the audio-completion repair; the final full gate for per-turn quality telemetry is pending

## Primary category evidence matrix

| Official criterion | Required product evidence | Status |
|---|---|---|
| Realistic scenarios | Three Phase 1 scenarios for underperformance feedback, saying no, and after-hours boundaries, with credible pushback | Underperformance/defensive spike implemented; catalogue pending |
| Practice and feedback | Spoken active rehearsal, transcript-grounded evaluation, and retry of a highlighted moment | Spike and grounded evaluation implemented; retry product flow pending |
| Confidence building | Explicit before/after preparedness rating and visible improvement comparison | Pending |

## Submission evidence policy

- Never fabricate growth, revenue, conversion, user feedback, test results, or public engagement.
- Keep judge instructions usable from the United States through the end of judging.
- Ensure the store build behaves exactly as depicted in the video and submission copy.
- Preserve reproducible artifacts or public URLs for every item marked complete.

Never mark an item complete without a reproducible artifact, console result, test output, or public
URL.
