# Shipaton Winning Scorecard

Verified against the official RevenueCat Shipaton 2026 Devpost overview and rules on 2026-08-20.
This document prioritises the existing requirements; it does not remove or replace any requirement
in `Say_It_First_Codex_Requirements.md`.

## Winning thesis

Say It First should win by being the most convincing answer to the Career Coaching brief:

> A new manager can rehearse the conversation they are avoiding, face realistic resistance, receive
> feedback tied to their exact words, retry the weak moment, and leave measurably more prepared.

The two-minute judge experience must prove that claim before discussing architecture.

## Award portfolio

| Award | Decision | Why it fits | Evidence required |
|---|---|---|---|
| Influencer Award — Career Coaching: Leadership Heather | Primary | The official prompt exactly matches the product | Realistic feedback/boundary/saying-no scenarios; active voice practice; useful transcript-grounded feedback; before/after preparedness |
| HAMM | Strong secondary | Paid urgent practice plus recurring development is a credible business model | Real RevenueCat purchase, polished contextual paywall, pricing rationale, conversion and revenue evidence |
| RevenueCat Design | Strong secondary | Voice presence, evidence-linked coaching, and retry comparison can be distinctive | Purposeful motion, polished gestures/states, accessibility, design rationale, device footage |
| #BuildInPublic | Strong secondary | Failures, human QA, evaluation calibration, and launch experiments create a credible story | Public posts, engagement, product changes caused by feedback, lessons and links |
| OneSignal Keep Them Coming Back | Phase 2 secondary | A pre-conversation rehearsal reminder is useful rather than spammy | Real SDK integration, App ID, deployed campaign/Journey, deep link, delivery evidence |
| Grand Prize | Conditional but mandatory to pursue | Early release and real RevenueCat revenue create shortlist potential | Release date, installs, activation, completed practices, retention, paying users, revenue, experiments and learning |
| RevenueCat Peace Prize | Enter only with truthful impact evidence | Better manager conversations may reduce avoidable workplace harm, but generic claims are weak | A defined beneficiary group, credible access programme or partnership, measured outcomes, and feasibility evidence |

Do not divert the product into games, Kotlin Multiplatform, Replit, Galaxy-specific work, ads, Noise,
Layers, or a Stripe web funnel before the primary product, billing, store release, and evidence loop
are stable. More integrations do not improve the score unless their award can be entered credibly.

## Eligibility gates

| Gate | Required outcome | Current state |
|---|---|---|
| New public app | First eligible-store release during the official submission window | Pending |
| Supported platform | Working Android app published to Google Play or Galaxy Store | Android spike works; store release pending |
| RevenueCat | Official SDK powers at least one genuine in-app purchase | SDK and Android Test Store purchase proven; genuine Play purchase pending |
| United States access | Judge can download and use the app in the US | Pending |
| Judge premium access | Working free trial or promo code through judging | Pending |
| Functional fidelity | Store build matches video and written claims | Pending |
| Demo | Public YouTube/Vimeo video under two minutes with device footage | Pending |
| Assets | 1024 x 1024 icon and at least one 1179 x 2556 frameless screenshot | Pending |
| Rights | Original/licensed assets and authorised third-party services | Audit pending |
| Influencer restriction | Only one influencer category; no influencer identity/brand use without consent | Product currently compliant; final marketing audit pending |

## Primary-category proof

### Realistic scenarios

The release must include at least:

- Underperformance feedback with defensive pushback.
- Saying no to an unreasonable request without becoming evasive or hostile.
- Setting an after-hours boundary while protecting trust and operational clarity.

Judges should hear resistance, ambiguity, emotion, and consequences—not a cooperative generic bot.

### Practice and feedback

The video and judge path must show:

1. The manager speaking naturally.
2. Alex responding in character.
3. Feedback quoting the manager's actual words.
4. One high-impact missed opportunity.
5. A retry from that exact moment.
6. A concrete original-versus-revised comparison.

### Confidence building

Use an explicit self-rating before and after practice. Present the delta as self-reported
preparedness, never as inferred emotion or biometric confidence. Pair the number with one concrete
next step so it is useful rather than decorative.

## Monetisation proof

Recommended V1 packaging:

- Free: onboarding, scenario discovery, two complete practices that demonstrate real value, limited
  history, and transparent privacy controls.
- Pro monthly: recurring practice, full scenario/persona access, retries, progress history, and
  scheduled-conversation preparation.
- Pro annual: the same entitlement with a clear annual saving and no invented urgency.
- Trial/judge path: a genuine Google Play trial or valid promo mechanism that unlocks all premium
  features through judging.

The paywall belongs after demonstrated value or at a clearly contextual premium action. Prices,
packages, trial eligibility, purchase, restore, cancellation, expiry, and entitlement refresh must
come from the real RevenueCat/Google Play configuration.

Current evidence: the official SDK, coded contextual paywall, live Test Store packages, purchase,
`Pro` entitlement activation, restore, and Customer Center have been exercised in the actual
Android UI. This is a development proof only. The qualifying Play-distributed purchase remains a
release gate. See `revenuecat-billing-runbook.md`.

## Growth proof

Ship early, then record a dated experiment ledger. Minimum truthful funnel:

`store view -> install -> onboarding complete -> practice started -> practice completed -> feedback viewed -> paywall viewed -> trial/purchase -> second practice`

For every experiment record:

- Hypothesis and audience.
- Exact product or acquisition change.
- Start/end dates and sample size.
- Installs, activation, completion, retention, conversion, revenue, and qualitative feedback where
  actually available.
- What changed next.

Never backfill or estimate competition metrics as if they were observed.

## Two-minute judge narrative

- 0-12 seconds: the avoided-conversation problem and one-line product promise.
- 12-45 seconds: choose a realistic scenario and begin speaking on a physical Android device.
- 45-78 seconds: show credible resistance and live transcript.
- 78-105 seconds: show evidence-linked feedback and preparedness change.
- 105-112 seconds: retry the missed moment and show improvement.
- 112-118 seconds: show the real RevenueCat offering/entitlement moment.
- 118-120 seconds: release/growth proof and final promise.

Do not spend scarce video time on code, generic feature lists, unverified claims, or a long founder
introduction. Technical quality should be visible through reliability, speed, polish, and grounded
results.

## Stop rules

- Do not claim the voice gate passed until one uninterrupted five-minute physical-device rehearsal
  finishes audibly and lifecycle/teardown checks pass.
- Do not claim RevenueCat compliance until a real Google Play purchase activates the entitlement.
- Do not claim a category integration from a mock, local-only substitute, test-store-only final
  build, or dashboard screenshot without the required live behaviour.
- Do not add a sponsor SDK solely to increase category count.
- Do not defer Google Play review, judge access, privacy/terms, or store assets until the final week.
