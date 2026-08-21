# Say It First

Practise the difficult workplace conversation before it becomes real.

Say It First is an Android-first voice rehearsal app for new managers. A manager chooses a
realistic workplace scenario, practises it with an AI-simulated employee, receives feedback tied to
their exact words, and retries the moment that needs work.

The project is being built for RevenueCat Shipaton 2026. Its primary competition target is the
Influencer Award — Career Coaching.

## Current state

Phase 1 is at the Realtime technical gate. The repository currently includes:

- A native Expo/React Native Android development build.
- Server-controlled OpenAI Realtime WebRTC negotiation.
- Physical-device voice rehearsal with explicit Android audio focus and speaker routing.
- Live transcript capture.
- Structured evaluation with exact-quote evidence validation.
- RevenueCat SDK integration with a polished contextual paywall, dynamic packages, purchase,
  restore, entitlement refresh, and Customer Center.
- Correlated, privacy-safe mobile and API diagnostics.
- Strict shared contracts and domain tests.

The RevenueCat Test Store flow is verified end to end, including `Pro` activation and the matching
dashboard transaction. It is development evidence only. The next release gates are one final
uninterrupted five-minute physical-device rehearsal, the three-scenario practice loop, Google Play
account approval, and a genuine Play-distributed purchase.

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
the application. Transcript text is excluded from routine diagnostics. The app does not claim that
voice or transcript processing stays entirely on-device; production disclosures must accurately
describe provider processing and retention controls.

## Verification

`pnpm check` runs linting, TypeScript checks, unit/API tests, and production-oriented package builds.
Production and competition builds must use real AI, billing, analytics, and store infrastructure;
fabricated purchases, responses, or growth evidence are prohibited.
