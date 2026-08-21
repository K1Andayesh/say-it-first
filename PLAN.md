# Say It First Delivery Plan

This file is the concise operational companion to `Say_It_First_Codex_Requirements.md`.
The requirements document remains authoritative.

## Current gate

Phase 1, Checkpoint 1 — realtime technical spike.

Do not expand into the complete product, RevenueCat, or OneSignal implementation until this gate
has a repeatable physical-device result or the turn-based fallback has been deliberately selected.

The primary competition target is the **Influencer Award — Career Coaching: Leadership Heather**.
Its official criteria map directly to the product contract: realistic new-manager scenarios,
active practice with useful feedback for feedback/boundaries/saying no, and measurable confidence
building. HAMM and RevenueCat Design are the strongest compatible secondary targets. See
`docs/shipaton-winning-scorecard.md` for the evidence plan and scope guardrails.

## Checkpoint 1 outcomes

1. A native Expo development build runs on a physical Android device.
2. The app establishes a voice session without placing a standard OpenAI key in the bundle.
3. The AI employee follows one bounded scenario and one persona.
4. The app captures a live transcript and terminates the session cleanly.
5. Structured evaluation links every coaching claim to a real user turn and exact quote.
6. Median/P95 response latency, five-minute stability, and estimated cost are measured.
7. An ADR selects WebRTC or the turn-based fallback.

## Evidence still required to leave the gate

- One uninterrupted five-minute physical-device rehearsal after the audio repairs.
- Human confirmation that every assistant reply finishes audibly.
- A larger latency sample sufficient to report median and P95 without overstating six turns.
- Representative practice cost measured from provider usage.
- Background/interruption and clean-teardown checks on the physical device.

The corrected six-turn rehearsal on 2026-08-20 is strong preliminary evidence, but it is not a
substitute for the explicit five-minute exit test.

## Phase 1 sequence after the gate

1. Lock the production name, Android package ID, and store/account path.
2. Build the three-scenario practice loop and its two Phase 1 personas.
3. Add local history, preparedness ratings, retry comparison, reminders, and privacy controls.
4. Integrate production RevenueCat offerings, entitlement enforcement, restore/manage paths, and
   a working judge trial or promo route.
5. Add release telemetry, crash reporting, store assets, privacy/terms, and a production AAB.
6. Publish early enough to run real acquisition, retention, paywall, and pricing experiments.

## Quality stance

- Build the visual language and service boundaries once; expand them after the spike.
- Prefer high-signal structured events over verbose logs.
- Never log audio, transcript text, custom context, tokens, or secrets.
- Carry request and trace identifiers across mobile, API, and provider calls.
- Treat every external dependency as fallible and make recovery observable.
