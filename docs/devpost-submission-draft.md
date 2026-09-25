# Devpost Submission Draft

Status: release-current draft updated 25 September 2026. Public Play availability is verified;
customer revenue is not claimed.

## Project name

Say It First

## Tagline

Rehearse the difficult workplace conversation before it becomes real.

## Short pitch

Say It First gives new managers a private place to practise high-stakes conversations out loud,
face realistic pushback, receive coaching tied to their exact words, and leave with a clearer next
sentence.

## Tell us more about your project

### Inspiration

New managers are surrounded by advice but rarely get a safe chance to practise. A script can tell
someone what good feedback sounds like; it cannot recreate the moment when an employee says, “That
is not fair,” the manager loses their thread, and the conversation becomes real.

Say It First was inspired by that gap between knowing and doing. It turns difficult management
conversations into active rehearsals so people can find the words, hear the resistance, and try
again before another person is affected.

### What it does

A manager enters a realistic underperformance-feedback rehearsal and speaks naturally with Alex,
an AI-simulated software engineer who stays in character and pushes back credibly.

The app captures a live transcript and produces structured feedback grounded in the manager's own
words. Instead of generic advice, it identifies the manager's strongest moment, explains why it
worked, and prepares an exact coached sentence to try next.

The free experience includes the core rehearsal, private debrief, and strongest transcript-grounded
moment. Say It First Pro reveals the exact coached sentence and unlocks an immediate focused retry
through a contextual RevenueCat-powered monthly or annual offer.

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
- The official Play-distributed build completed a no-charge Google Play license-test Annual
  subscription and activated the same `Pro` entitlement on a Samsung Galaxy S10.
- A controlled Samsung regression played an approximately 53-second response through the prior
  26-second failure point and reached its exact completion phrase; the session then produced a
  grounded debrief and clean audio teardown.
- Full repository lint, strict TypeScript, 30 automated tests, API/shared builds, Android export,
  and a separately signed Android lab build pass together.

### What we learned

Protocol success is not user success. Audio has to be heard to the final word, feedback has to be
traceable to something the manager actually said, and a purchase only matters when the exact
entitlement unlocks the promised value.

We also learned that observability can improve the product rather than merely support it. The same
boundaries that make a failure diagnosable—structured session states, grounded evidence, exact
billing identifiers, and privacy-safe traces—make the experience more trustworthy for a nervous
manager.

### What's next for Say It First

Say It First is now publicly available on Google Play in Australia, Canada, New Zealand, the United
Kingdom, and the United States. The next product step is deliberately narrow: learn from real
practice completion, repeat use, conversion, and qualitative manager feedback before expanding the
surface area.

The roadmap includes additional scenarios and personas, a highlighted-moment retry, private
history and deletion controls, server-side entitlement enforcement, and deeper billing lifecycle
verification for cancellation, renewal, expiry, and reinstall. License-test evidence will never be
presented as customer revenue.

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

## Submission evidence

- Public Google Play URL: https://play.google.com/store/apps/details?id=app.sayitfirst
- First public release verified inside the Shipaton eligibility window.
- Launch availability configured for Australia, Canada, New Zealand, the United Kingdom, and the
  United States.
- Reviewer access is documented privately in Google Play Console; no access credential belongs in
  the public Devpost story.
- Public demo video: https://youtu.be/31-7EvkX-lw
- The gallery includes the final thumbnail and exact-size app screenshots.
- License-test purchases prove the RevenueCat integration without being represented as customer
  revenue.
- Public Devpost project: https://devpost.com/software/say-it-first
