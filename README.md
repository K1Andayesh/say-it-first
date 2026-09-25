# Say It First

Practise the difficult workplace conversation before it becomes real.

Say It First is an Android-first voice rehearsal app for new managers. A manager chooses a
realistic workplace scenario, practises it with an AI-simulated employee, receives feedback tied to
their exact words, and retries the moment that needs work.

The project was built for RevenueCat Shipaton 2026. Its primary competition target is the
Influencer Award — Career Coaching.

- [Get Say It First on Google Play](https://play.google.com/store/apps/details?id=app.sayitfirst)
- [Watch the public demo](https://youtu.be/31-7EvkX-lw)
- [View the Shipaton submission](https://devpost.com/software/say-it-first)

## Current state

Say It First is publicly available on Google Play in Australia, Canada, New Zealand, the United
Kingdom, and the United States. The released product includes:

- A native Expo/React Native Android app tested on physical Samsung hardware.
- Server-controlled OpenAI Realtime WebRTC negotiation.
- Physical-device voice rehearsal with explicit Android audio focus and speaker routing.
- Live transcript capture.
- Structured evaluation with exact-quote evidence validation.
- RevenueCat SDK integration with a polished contextual paywall, dynamic packages, purchase,
  restore, entitlement refresh, and Customer Center.
- Correlated, privacy-safe mobile and API diagnostics.
- Strict shared contracts and domain tests.

RevenueCat is verified through both its Test Store and the official Play-distributed build. A
Google Play license-test Annual subscription opened the native billing sheet, completed without a
charge, and activated the case-sensitive `Pro` entitlement in the app. This proves the production
SDK/store path, but it is not real revenue. Closed testing, production access, and the public Play
release are complete. Real customer conversion and retention remain post-launch evidence targets.

## Repository layout

```text
apps/mobile       Expo + React Native Android application
apps/api          Fastify API and trusted AI/provider boundary
packages/contracts Shared network and evaluation schemas
packages/domain    Scenarios, prompts, evidence, and session state
docs              Architecture, ADRs, privacy, compliance, and competition evidence
```

## Local development

Prerequisites:

- Node.js 24+
- pnpm 11.19+
- Android Studio/SDK for a native Android development build
- A server-side OpenAI API credential

Install and verify:

```bash
pnpm install
pnpm check
```

Create local environment files from `.env.example`. Never place server credentials in
`EXPO_PUBLIC_*` variables or in the mobile bundle.

Run the trusted API:

```bash
pnpm dev:api
```

Run the mobile development client:

```bash
pnpm dev:mobile
```

## Product and delivery contract

- [Product and implementation requirements](./Say_It_First_Codex_Requirements.md)
- [Delivery plan](./PLAN.md)
- [Active tasks](./TASKS.md)
- [Shipaton winning scorecard](./docs/shipaton-winning-scorecard.md)
- [Compliance evidence](./docs/shipaton-compliance.md)
- [RevenueCat billing runbook](./docs/revenuecat-billing-runbook.md)
- [Devpost submission draft](./docs/devpost-submission-draft.md)
- [Architecture](./docs/architecture.md)

## Privacy stance

Raw microphone audio is transported only for the active realtime rehearsal and is not retained by
the application. Transcript text is excluded from routine diagnostics. If a user explicitly files
a content report, the reported response and limited context are retained for up to 30 days for
safety review. The app does not claim that voice or transcript processing stays entirely on-device;
production disclosures accurately describe provider processing and retention controls.

## Verification

`pnpm check` runs linting, TypeScript checks, unit/API tests, and production-oriented package builds.
Production and competition builds must use real AI, billing, analytics, and store infrastructure;
fabricated purchases, responses, or growth evidence are prohibited.
