# Active Tasks

## Release-first sprint — completed 25 September 2026

- [x] Recheck current Play status and the official Shipaton rules.
- [x] Send closed-test version 6 to Google for review; it appeared under "Changes in review"
      while automated quick checks were running. Do not call it available to testers yet.
- [x] Re-run lint, TypeScript, 32 automated tests, and Android export.
- [x] Replace the scaffold Expo icon with reproducible Say It First launcher/adaptive/splash
      artwork in source. This artwork is not in Play version 6.
- [x] Complete Play-distributed physical-device QA, including the 540-density layout, complete
      audible responses, grounded debrief, purchase/restore, and clean session teardown.
- [x] Prepare and verify a new store build containing the branded icon and confirmed release fixes.
- [x] Complete the closed-test gate and receive Google Play production access.
- [x] Publish the Play listing in Australia, Canada, New Zealand, the United Kingdom, and the
      United States, with truthful judge access and RevenueCat integration evidence.
- [x] Publish the public demo video, submission gallery assets, and final Devpost entry.
- [x] Verify the public store listing and shipped build before Devpost submission.

## Phase 1 — Checkpoint 1

- [x] Confirm workspace and local Android/Node toolchain.
- [x] Confirm official OpenAI WebRTC session architecture.
- [x] Scaffold monorepo and strict shared contracts.
- [x] Add safe structured logging, correlation IDs, tracing, health, and readiness.
- [x] Add the underperformance scenario and defensive persona.
- [x] Implement the server-controlled OpenAI Realtime WebRTC session proxy.
- [x] Implement grounded structured evaluation, one corrective retry, and quote validation.
- [x] Implement the Android realtime voice spike screen and live transcript.
- [x] Add unit and API integration tests.
- [x] Produce and install an Android development build on a Pixel 9 emulator.
- [x] Verify the landing, microphone permission, connecting, and recoverable failure UI on Android.
- [x] Install and run the native development build on a Pixel 10 Pro XL physical device.
- [x] Verify server-controlled Realtime negotiation, transcript capture, grounded evaluation, and
      clean user-initiated teardown on the physical device.
- [x] Remove false VAD interruption, own Android audio focus/speaker routing, and remove the
      accidental 280-output-token speech ceiling.
- [x] Capture a corrected six-turn rehearsal: all six assistant responses completed normally with
      no protocol truncation or audio-buffer clear.
- [ ] Run one uninterrupted physical-device five-minute test and obtain human audible-completion
      confirmation.
- [ ] Measure a representative latency distribution and practice cost.
- [ ] Verify backgrounding, interruption, timeout, and teardown on the physical device.
- [ ] Record cost findings and architecture decision.

## External release inputs still required

- [x] Lock final application name `Say It First` and production Android package `app.sayitfirst`.
- [x] Record the Google Play personal-account verification and production-access status; identity
      review is the current external gate.
- [x] Create the RevenueCat project/app, configure separate Test Store and production public SDK
      keys, and lock offering/entitlement identifiers.
- [ ] Create Google Play products and base plans, then finalise real pricing and trial/judge access
      after Play enables app creation.
- [ ] Privacy-policy and support URLs for the store listing.

## Phase 1 next — after Checkpoint 1 is accepted

- [ ] Implement the complete three-scenario/two-persona practice catalogue.
- [ ] Implement preparedness ratings, local history/delete, highlighted-moment retry, comparison,
      and privacy-safe local reminder.
- [x] Integrate `react-native-purchases` and `react-native-purchases-ui` in a billing service.
- [x] Implement dynamic monthly/annual packages, the case-sensitive `Pro` entitlement, contextual
      paywall, purchase, restore, Customer Center, and privacy-safe billing diagnostics.
- [ ] Production-test cancellation, renewal, expiry/revocation, offline/reinstall behaviour, and a
      genuine judge trial or promo path through a Play-distributed build.
- [ ] Enforce paid usage on the server with RevenueCat-backed entitlement snapshots and idempotent
      webhooks.
- [ ] Add privacy-safe funnel analytics, crash reporting, AI cost/error monitoring, and support.
- [ ] Prepare Play listing, Data Safety answers, content rating, production AAB, and US availability.
- [ ] Publish Phase 1 and begin evidence-backed acquisition, retention, monetisation, and
      Build-in-Public experiments.
