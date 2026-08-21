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
- RevenueCat Test Store purchase: complete on Android; not a qualifying production purchase
- RevenueCat production purchase: pending Google Play configuration and Play-distributed test
- Judge access: pending
- English text description: draft complete; final production claims and links pending
- Public demo video shorter than two minutes: pending
- 1024 x 1024 icon: pending
- 1179 x 2556 frameless screenshot: pending
- Category-specific submission copy: draft complete; final production evidence pending

## Play production access

- Account type: personal developer account
- Account creation date: not yet recorded
- Verification status: Google identity-document review in progress
- Contact phone: verification disabled until identity approval
- Create app: disabled until identity approval
- Existing production access: none confirmed
- Closed-test requirement applies: to be confirmed after account verification

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
- RevenueCat native SDK and UI modules compiled into the Android debug build; the manifest includes
  Google Play Billing permission and store-shaped builds use purchase-safe `singleTop` activity mode
- RevenueCat Test Store offering `default` loaded two live packages; a valid Annual purchase
  activated the case-sensitive `Pro` entitlement, restore succeeded, and Customer Center opened
- RevenueCat dashboard recorded the matching sandbox Yearly subscription; sandbox entitlement
  access is restricted to the current test app user ID
- Production RevenueCat Play app created for `app.sayitfirst`; Play service credentials and real
  products remain pending the Google account gate
- Personal EAS project `@keyvan.andayesh/say-it-first` linked; Test Store keys are isolated to
  development/preview and the Play public SDK key is configured only in the production environment
- Standard provider secret absent from mobile bundle: architecture enforced; production AAB audit
  remains pending
- Automated verification: native Android build passed; the full repository lint, strict TypeScript,
  26-test suite, API/package builds, and Android export passed on 21 August 2026

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
