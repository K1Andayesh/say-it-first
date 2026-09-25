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

- First public release: production version 8 released on 22 September 2026, inside the eligibility
  window
- Google Play URL: https://play.google.com/store/apps/details?id=app.sayitfirst
- United States availability: complete; the app is available in the United States and four other
  launch countries
- RevenueCat Test Store purchase: complete on Android
- RevenueCat Play integration: Play-distributed no-charge license-test Annual subscription
  activated `Pro`; first non-test customer transaction remains pending
- Judge access: a reusable 60-day Google Play Annual promotion and bounded in-app reviewer fallback
  are supplied through judge-only Devpost fields; renewal behaviour is disclosed there
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
- Initial production reach: Google Play Console reported 18 installs on 25 September 2026. This is
  an install count, not evidence of retention, conversion, paid customers, or revenue.

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
- Samsung backgrounding regression on production version 8: leaving an active live rehearsal
  abandoned the app's Android audio focus and returned to an explicit “Session closed safely”
  state that explained the microphone connection had ended and offered a fresh rehearsal.
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
- Bounded cost evidence: the selected Say It First OpenAI project reported $0.38 total spend,
  13,580 tokens, and 35 requests for the seven days ending 25 September 2026. The visible Realtime
  categories totalled approximately $0.373 ($0.022 audio input, $0.284 audio output, $0.024 text
  input, $0.042 text output, and $0.001 cached text input). This window includes QA activity and is
  not represented as a per-practice cost or customer-usage metric.
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
- Production version 8 restore regression on 25 September 2026: after the time-compressed license
  subscription was no longer active, Restore purchases completed safely and displayed “No active
  Pro purchase was found for this account” rather than retaining stale access or failing silently
- Personal EAS project `@keyvan.andayesh/say-it-first` linked; Test Store keys are isolated to
  development/preview and the Play public SDK key is configured only in the production environment
- Standard provider secret absent from tracked source and the exported mobile bundle: architecture
  enforced; no secret-pattern match was found in tracked repository files on 25 September 2026
- Automated verification: full repository lint, strict TypeScript, 41 automated tests, API/shared
  builds, and Android export passed on 25 September 2026. A separately signed Android lab build
  passed on 29 August 2026, and production version 8 subsequently passed Play-device QA.
- New Say It First launcher, adaptive, monochrome, and splash assets were generated reproducibly,
  visually checked, included in production version 8, and reflected in the public store listing.

## Primary category evidence matrix

| Official criterion | Required product evidence | Status |
|---|---|---|
| Realistic scenarios | A credible career-coaching rehearsal with resistance and consequences | Underperformance feedback with defensive pushback is implemented and shipped; catalogue expansion is post-judging work |
| Practice and feedback | Spoken active rehearsal, transcript-grounded evaluation, and a focused retry | Shipped voice rehearsal, grounded debrief, exact coached sentence, and Pro retry path are present in version 8 |
| Confidence building | Feedback that gives the manager a concrete next step | Shipped debrief identifies the strongest grounded moment and an exact next sentence; explicit before/after preparedness remains post-judging work |

## Submission evidence policy

- Never fabricate growth, revenue, conversion, user feedback, test results, or public engagement.
- Keep judge instructions usable from the United States through the end of judging.
- Ensure the store build behaves exactly as depicted in the video and submission copy.
- Preserve reproducible artifacts or public URLs for every item marked complete.

Never mark an item complete without a reproducible artifact, console result, test output, or public
URL.
