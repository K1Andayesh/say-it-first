# Devpost Submission Draft

Status: working draft created 21 August 2026. Replace pending release evidence with verified public
URLs and production results before submitting.

## Project name

Say It First

## Tagline

Rehearse the difficult workplace conversation before it becomes real.

## Short pitch

Say It First gives new managers a private place to practise high-stakes conversations out loud,
face realistic pushback, receive coaching tied to their exact words, and retry the moment that
needs work.

## Tell us more about your project

### Inspiration

New managers are surrounded by advice but rarely get a safe chance to practise. A script can tell
someone what good feedback sounds like; it cannot recreate the moment when an employee says, “That
is not fair,” the manager loses their thread, and the conversation becomes real.

Say It First was inspired by that gap between knowing and doing. It turns difficult management
conversations into active rehearsals so people can find the words, hear the resistance, and try
again before another person is affected.

### What it does

A manager chooses a realistic situation—such as underperformance feedback, saying no, or setting
an after-hours boundary—and an employee response style. They rate how prepared they feel, then
speak naturally with an AI-simulated employee that stays in character and pushes back credibly.

The app captures a live transcript and produces structured feedback grounded in the manager's own
words. Instead of generic advice, it identifies one high-impact moment, explains what was missing,
and lets the manager retry from that point. The experience closes with a concise original-versus-
revised comparison and a self-reported preparedness change.

Say It First Pro is designed for recurring practice, the full scenario and persona catalogue,
retries, and progress history. The free experience demonstrates real value before presenting a
contextual RevenueCat-powered monthly or annual offer.

### How we built it

The Android app uses Expo and React Native with a native development client. A Fastify API owns the
trusted AI boundary, provider credentials, session configuration, and evidence-grounded evaluation.
OpenAI Realtime runs over WebRTC for low-latency voice, while shared TypeScript contracts keep the
mobile, API, and domain layers aligned.

RevenueCat's React Native SDK powers dynamic packages, purchase and restore flows, entitlement
refresh, and Customer Center. The coded paywall renders store-provided names and prices and derives
annual savings only when the live package currencies are comparable. Development, preview, and
production keys are isolated through EAS environments.

Every mobile, API, and provider interaction carries correlation identifiers and privacy-safe
diagnostics. Logs include lifecycle, latency, audio receiver quality, package identifiers, and safe
error codes, while excluding microphone audio, transcript text, payment details, and credentials.

### Challenges we ran into

The hardest failure looked healthy in ordinary logs: an assistant reply completed at the protocol
level but the user heard it stop or corrupt in the middle. We treated human listening as the source
of truth, removed an accidental response ceiling, took explicit ownership of Android audio focus
and speaker routing, and added per-turn receiver evidence for packet loss, jitter, and concealed
samples. That made network delivery, decoding, provider completion, and device routing separately
debuggable.

Billing exposed a similarly dangerous edge case. RevenueCat's dashboard-created entitlement was
the immutable, case-sensitive `Pro`, while the first implementation checked lowercase `pro`. An
actual Android purchase test caught the mismatch before release, and a regression test now locks
the exact production contract.

### Accomplishments that we're proud of

- A real-time spoken rehearsal, live transcript, clean teardown, and quote-validated structured
  evaluation run on Android.
- Controlled short, 30-second, and 50-second assistant replies reached their spoken completion
  markers with zero receiver packet loss in the measured runs.
- The native RevenueCat Test Store path loads live packages, completes an annual sandbox purchase,
  activates `Pro`, restores access, and opens Customer Center in the actual Android UI.
- The RevenueCat dashboard records the matching sandbox subscription. This is development evidence,
  not real revenue or the final Shipaton-qualifying Play purchase.
- The full repository lint, strict TypeScript checks, 26 automated tests, API/package builds, and
  Android export pass together.

### What we learned

Protocol success is not user success. Audio has to be heard to the final word, feedback has to be
traceable to something the manager actually said, and a purchase only matters when the exact
entitlement unlocks the promised value.

We also learned that observability can improve the product rather than merely support it. The same
boundaries that make a failure diagnosable—structured session states, grounded evidence, exact
billing identifiers, and privacy-safe traces—make the experience more trustworthy for a nervous
manager.

### What's next for Say It First

Before public release we will complete the three-scenario, two-persona Phase 1 practice loop,
preparedness comparison, highlighted-moment retry, history/deletion, server-side entitlement
enforcement, hosted privacy/support pages, and production monitoring.

Google is currently reviewing the personal Play developer account's identity documents. Once app
creation is enabled, we will configure the monthly and annual Play subscriptions, connect service
credentials and developer notifications to RevenueCat, distribute the AAB through Play testing,
and verify purchase, cancellation, restore, renewal, expiry, reinstall, and banking-app return.
Only a Play-distributed transaction will be presented as the qualifying purchase.

After launch, the focus moves to real evidence: practice completion, repeat use, conversion,
revenue, qualitative manager feedback, and the product changes those signals cause. A useful
OneSignal reminder and deep link will be added only after the core return loop is stable.

## Built with

- Android
- Expo
- React Native
- TypeScript
- Fastify
- OpenAI Realtime API
- WebRTC
- RevenueCat
- EAS Build
- Vitest
- Zod

## Primary category

Influencer Award — Career Coaching: Leadership Heather

The product and marketing must not use the influencer's name, likeness, voice, brand, logo, or
identifying features without written consent. The category name above is submission metadata only.

## Final evidence still required

- Public Google Play URL and first-release date inside the eligibility window.
- United States availability and judge access.
- Genuine Play-distributed RevenueCat purchase and verified lifecycle tests.
- Public demo video under two minutes.
- 1024 x 1024 icon and 1179 x 2556 frameless screenshot.
- Final production metrics, user feedback, and public build-in-public links.
