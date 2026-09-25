# Shipaton Compliance Evidence

Status: release-current as of 2026-09-25. Say It First is publicly available on Google Play and the
Devpost entry is submitted. The rules were last rechecked on 2026-09-17 (including the August 31
update).

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
- RevenueCat Test Store purchase: complete on Android
- RevenueCat Play integration: Play-distributed no-charge license-test Annual subscription
  activated `Pro`; first non-test customer transaction remains pending
- Judge access: supplied through the submission/reviewer instructions
- English text description: submitted with bounded production claims and public links
- Public demo video shorter than two minutes: published at https://youtu.be/31-7EvkX-lw
- 1024 x 1024 icon: branded asset included in the production release and submission
- 1179 x 2556 frameless screenshot: included in the submission gallery
- Category-specific submission copy: submitted with verified production evidence

## Play production access

- Account type: personal developer account
- Account creation date: not recorded in this repository
- Verification status: complete enough to create and distribute the app
- App/test status: the closed-test count and duration requirements were completed; version 6 was
  available to closed testers before the production submission.
- Production access: granted by Google Play on 22 September 2026.
- Production status: version 8 approved and publicly available in Australia, Canada, New Zealand,
  the United Kingdom, and the United States.

## Technical evidence

- Physical-device realtime test: a 5m17s Pixel 10 Pro XL rehearsal completed with 29 transcript
  turns, clean WebRTC teardown, and grounded evaluation, but one assistant reply had transient
  audible corruption; the stable-session gate therefore remains open
- Controlled audible retest: short, approximately 30-second, and approximately 50-second assistant
  replies all reached their spoken completion markers without cutting out, skipping, distortion,
  silence, or repetition
- Samsung Galaxy S10 regression: an externally recorded assistant response remained active for
  approximately 53 seconds, passed the previously failing 26-second point, and reached the exact
  requested completion phrase. The same Play build produced a grounded debrief and clean WebRTC,
  microphone, audio-focus, and network teardown.
- Samsung display-scaling regression: the original 540-density setting exposed live controls below
  the viewport. The adaptive layout shipped after physical-device regression testing kept the
  Mute and End & reflect controls accessible during a live session.
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
- Production RevenueCat Play app for `app.sayitfirst` returns the live Monthly and Annual packages;
  a Play license-test Annual subscription activated `Pro` in the official store build
- Personal EAS project `@keyvan.andayesh/say-it-first` linked; Test Store keys are isolated to
  development/preview and the Play public SDK key is configured only in the production environment
- Standard provider secret absent from mobile bundle: architecture enforced; production AAB audit
  remains pending
- Automated verification: full repository lint, strict TypeScript, 32 automated tests, API/shared
  builds, and Android export passed on 17 September 2026. A separately signed Android lab build
  passed on 29 August 2026; this does not substitute for version 6 Play-device QA.
- New Say It First launcher, adaptive, monochrome, and splash assets were generated reproducibly,
  visually checked, included in production version 8, and reflected in the public store listing.

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
