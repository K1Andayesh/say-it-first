# Active Tasks

## Release-first sprint — completed 25 September 2026

- [x] Recheck current Play status and the official Shipaton rules.
- [x] Send closed-test version 6 to Google for review; it appeared under "Changes in review"
      while automated quick checks were running. Do not call it available to testers yet.
- [x] Re-run lint, TypeScript, 41 automated tests, and Android export.
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
- [x] Record a bounded live cost baseline: the Say It First OpenAI project reported $0.38 total
      spend, 13,580 tokens, and 35 requests for the seven days ending 25 September 2026; this is an
      aggregate QA/production window, not a per-practice estimate.
- [x] Verify that backgrounding the live rehearsal closes the microphone/WebRTC session, abandons
      Android audio focus, and returns to an explicit safe-closure state on the Samsung device.
- [ ] Verify independent call/audio interruption and timeout recovery on the physical device.
- [ ] Record cost findings and architecture decision.

## External release inputs

- [x] Lock final application name `Say It First` and production Android package `app.sayitfirst`.
- [x] Record the Google Play personal-account verification and production-access status; identity
      review is the current external gate.
- [x] Create the RevenueCat project/app, configure separate Test Store and production public SDK
      keys, and lock offering/entitlement identifiers.
- [x] Create Google Play Monthly and Annual products/base plans and configure production pricing.
- [x] Create a reusable 60-day Google Play judge promotion and document the redemption path in the
      judge-only Devpost fields.
- [x] Publish live privacy-policy, terms, and support URLs and attach them to the store listing.

## Post-judging product backlog

The public version 8 build is frozen through judging unless a reproducible production defect is
found. These items are valuable product work, but they are not Shipaton eligibility blockers and
must not be rushed into the submitted build.

- [ ] Implement the complete three-scenario/two-persona practice catalogue.
- [ ] Implement preparedness ratings, local history/delete, highlighted-moment retry, comparison,
      and privacy-safe local reminder.
- [x] Integrate `react-native-purchases` and `react-native-purchases-ui` in a billing service.
- [x] Implement dynamic monthly/annual packages, the case-sensitive `Pro` entitlement, contextual
      paywall, purchase, restore, Customer Center, and privacy-safe billing diagnostics.
- [x] Provide a genuine 60-day judge promotion through Google Play and a bounded in-app reviewer
      fallback, with renewal disclosure in the judge-only submission notes.
- [x] Verify the expired/no-active-purchase restore path in production version 8: RevenueCat/Google
      Play refresh completes and the UI clearly reports that no active Pro purchase exists.
- [ ] Production-test cancellation, renewal, explicit revocation, offline, and reinstall behaviour.
- [ ] Enforce paid usage on the server with RevenueCat-backed entitlement snapshots and idempotent
      webhooks.
- [ ] Add privacy-safe funnel analytics, crash reporting, AI cost/error monitoring, and support.
- [x] Prepare and publish the Play listing, Data Safety answers, content rating, production AAB,
      and availability in Australia, Canada, New Zealand, the United Kingdom, and the United States.
- [x] Publish Phase 1 and record the initial evidence-backed Build-in-Public work.
- [ ] Continue evidence-backed acquisition, retention, and monetisation experiments without
      presenting tester activity or license-test purchases as customer revenue.
