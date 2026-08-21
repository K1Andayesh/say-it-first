# RevenueCat Shipaton 2026 — Android Project Requirements

## 1. Objective

Design, build, publish, and promote a **new Android application** for RevenueCat Shipaton 2026.

The project should not merely satisfy the entry requirements. It should be designed to compete seriously for one or more Shipaton awards by combining:

- A strong and easily understood consumer problem
- Excellent Android UX
- A compelling reason for users to return
- RevenueCat-based monetisation that feels native to the product
- A realistic path to acquiring users during the competition
- A polished two-minute competition demonstration

The application should be sufficiently scoped to allow an initial public release well before the competition deadline, followed by multiple iterations based on real user feedback.

---

# 2. Competition Constraints

## 2.1 Platform

The initial release will target:

**Android only**

Distribution:

**Google Play Store**

Samsung Galaxy Store may be considered later if doing so provides a reasonable opportunity to compete for the Samsung-specific Shipaton award, but it is not an MVP requirement.

---

## 2.2 Release Window

The application's **first-ever public release** must occur between:

**1 August 2026 – 30 September 2026**

The application must therefore be a genuinely new store listing.

An existing publicly released application cannot simply be updated and entered.

Development may have started before August 1 provided that the application was not publicly released before the competition window.

---

# 3. Mandatory RevenueCat Requirement

The application must integrate the **RevenueCat SDK**.

At least one genuine monetisation mechanism must be implemented using RevenueCat.

Preferred approach:

### Free + Premium Subscription

Example entitlement:

`premium`

Possible products:

- Monthly Premium
- Annual Premium

Optional:

- Lifetime purchase

The paid functionality must be meaningful rather than a superficial purchase added only to satisfy Shipaton requirements.

RevenueCat must control access to premium functionality through customer entitlements.

The application must correctly handle:

- New purchases
- Subscription state
- Restore purchases
- Expired subscriptions
- Cancelled subscriptions
- Purchase errors
- Network failure
- Already-owned products
- Entitlement refresh

---

# 4. Google Play Billing

All Android in-app purchases must use the supported Google Play billing mechanism through RevenueCat.

Production products must be configured in:

1. Google Play Console
2. RevenueCat
3. Android application

The production version must demonstrate a real, working purchase flow.

A RevenueCat test-store-only implementation is **not sufficient for the final submission**.

---

# 5. Product Requirements

## 5.1 Core Product Principle

The app should have one extremely clear core proposition.

A new user should understand within approximately 10–15 seconds:

> What does this application do for me?

The MVP should favour **one excellent workflow** over many mediocre features.

---

## 5.2 User Journey

The minimum user journey should be:

### Acquisition

User discovers app.

↓

### Store page

User understands the benefit immediately.

↓

### Installation

Application launches without mandatory complexity.

↓

### Onboarding

User understands what the application does.

↓

### First Value

User receives useful output/result before being asked to pay whenever reasonably possible.

↓

### Retention Loop

There is a reason to return.

↓

### Monetisation

Premium features are introduced when the user understands their value.

↓

### Purchase

RevenueCat handles subscription/purchase.

↓

### Continued Value

Premium functionality provides recurring benefit.

---

# 6. Onboarding Requirements

Onboarding should be very short.

Target:

**3–5 screens maximum**

It should explain:

1. The user's problem
2. What the app does
3. The main benefit
4. Any important permissions
5. How to start

Avoid requiring account creation before the user experiences the product unless technically necessary.

The user should reach the core functionality within approximately:

**30–60 seconds after launch.**

---

# 7. Paywall Requirements

The paywall is an important competition feature rather than an afterthought.

It should clearly show:

### Free

What the user can do without paying.

### Premium

What additional value the user receives.

The paywall should support:

- Monthly subscription
- Annual subscription
- Restore purchases
- Terms
- Privacy policy

The annual plan should normally represent better value than paying monthly for twelve months.

Where appropriate, introduce a free trial.

The competition submission must provide judges either:

- A free trial

or

- A mechanism/promo code allowing them to access all premium features.

---

# 8. Retention Requirements

The application should contain at least one deliberate retention mechanism.

Depending on the final product concept, this could include:

- Personal history
- Progress tracking
- Daily content
- Saved items
- Streaks
- Goals
- Recommendations
- Reminders
- Notifications
- Personalisation
- User-generated data
- AI-generated insights based on previous activity

The retention mechanism should arise naturally from the value of the product rather than relying solely on artificial gamification.

---

# 9. Analytics

The application should collect enough analytics to understand the acquisition and monetisation funnel.

Minimum events:

- App opened
- Onboarding started
- Onboarding completed
- Core action started
- Core action completed
- Paywall displayed
- Subscription selected
- Purchase initiated
- Purchase completed
- Purchase failed
- Trial started
- Premium feature used

Where possible, track:

- Day-1 retention
- Day-7 retention
- Activation rate
- Paywall view rate
- Trial conversion
- Purchase conversion
- Revenue
- Subscriber retention

These numbers will be valuable for the final Shipaton submission.

---

# 10. Architecture

Recommended technical implementation:

### Client

- React Native
- Expo
- TypeScript

or native Android/Kotlin if a feature specifically benefits from native APIs.

Given development speed, the preferred default is:

**React Native + Expo + TypeScript**

with an Android-first release.

### Monetisation

- RevenueCat
- Google Play Billing

### Backend

Only introduce a backend where the product genuinely requires it.

Possible stack:

- Node.js
- Fastify
- TypeScript
- PostgreSQL

### Authentication

Authentication should be optional unless persistence or cloud synchronisation requires it.

Possible options:

- Google Sign-In
- Email/password
- Anonymous/local account upgraded later

### Analytics / Crash Reporting

At minimum:

- Product analytics
- Crash reporting
- RevenueCat analytics

---

# 11. Android Quality Requirements

The application must:

- Install correctly from Google Play
- Launch reliably
- Handle background/foreground transitions
- Support common modern Android screen sizes
- Work correctly with gesture navigation
- Handle connectivity loss gracefully
- Avoid visible crashes
- Avoid obvious ANRs
- Maintain user state
- Handle Android lifecycle events correctly

Target release quality should be materially higher than a typical hackathon prototype.

This is a **published consumer application**, not merely a demo.

---

# 12. Design Requirements

The app should have a distinctive visual identity.

Required:

- Custom application icon
- Consistent typography
- Consistent spacing
- Appropriate animations
- Empty states
- Loading states
- Error states
- Success feedback
- Dark/light theme where appropriate
- Proper Android back-navigation behaviour

Animation should support understanding and polish rather than simply adding movement.

The app should look credible enough that a user encountering it on Google Play would reasonably believe it is a commercial product.

---

# 13. Google Play Requirements

Before launch we must prepare:

- Google Play developer account
- Package/application ID
- Application name
- App icon
- Feature graphic
- Phone screenshots
- App description
- Short description
- Privacy policy
- Data Safety declaration
- Content rating
- Target audience declaration
- Production AAB
- Signing configuration
- RevenueCat products
- Google Play Billing configuration

Because Play review can introduce uncertainty, the application should **not be submitted for the first time on September 29 or 30**.

Our internal target should be considerably earlier.

---

# 14. Shipaton Submission Requirements

The Devpost submission must contain:

### Application Description

A clear written description covering:

- Problem
- Solution
- Target users
- Main features
- Monetisation
- Technology
- RevenueCat integration
- What differentiates the application

### Demo Video

Maximum:

**2 minutes**

The judges are not required to watch footage beyond the two-minute limit.

The video should show the application actually running on its intended device/platform.

Recommended structure:

**0–15 seconds**

Problem and hook.

**15–40 seconds**

Core user experience.

**40–75 seconds**

The application's strongest or most distinctive capability.

**75–100 seconds**

Premium experience and RevenueCat monetisation.

**100–120 seconds**

Why users will continue using it and why the product matters.

The video must be publicly accessible through YouTube or Vimeo.

### Store URL

Provide the fully published Google Play Store URL.

### Application Icon

Provide:

**1024 × 1024**

### Screenshot

Provide at least one screenshot at:

**1179 × 2556**

without a device frame.

### Premium Judge Access

Provide either:

- Free trial

or

- Appropriate judge access/promo mechanism.

---

# 15. Awards Strategy

Rather than trying to win everything, the product should be designed around approximately **two primary award targets and one secondary target**.

## Primary Candidate: RevenueCat Design Award

Strong opportunity if we build:

- Beautiful UX
- Excellent animation
- Distinctive visual language
- Extremely polished interaction

## Primary Candidate: HAMM Award

Strong opportunity if monetisation is integral to the product rather than simply placing functionality behind a paywall.

RevenueCat describes this category as rewarding a robust and creative monetisation strategy.

Potential elements:

- Free tier
- Usage limits
- Subscription
- Trial
- Contextual paywall
- Annual/monthly pricing
- Premium features whose value is obvious

## Secondary Candidate: #BuildInPublic

Development progress should therefore be documented from the beginning.

Possible content:

- Initial concept
- UI experiments
- Architecture decisions
- RevenueCat integration
- Problems encountered
- User feedback
- Features removed
- Features added because of feedback
- Play Store launch
- First users
- First purchase
- Conversion experiments

---

# 16. Grand Prize Consideration

The 2026 Grand Prize is particularly important because RevenueCat is explicitly rewarding **user traction and growth momentum**, rather than simply selecting the technically best application.

Therefore:

**shipping early is a product requirement.**

The target should not be:

> Finish on September 29.

Instead:

> Release an excellent V1 early enough to spend several weeks acquiring users and improving it.

The product should therefore have:

- A clearly identifiable audience
- A simple acquisition channel
- Shareable value
- Low onboarding friction
- A reason to recommend it
- Measurable growth

---

# 17. Development Strategy

## Phase 1 — Concept

Define:

- One target user
- One painful/problematic behaviour
- One main value proposition
- One monetisation mechanism
- One acquisition strategy

## Phase 2 — Prototype

Build the primary user workflow.

Ignore peripheral functionality.

## Phase 3 — MVP

Add:

- Persistence
- Onboarding
- RevenueCat
- Paywall
- Analytics
- Error handling

## Phase 4 — Store Release

Publish V1 to Google Play.

## Phase 5 — Growth

Acquire real users.

Measure behaviour.

Collect feedback.

## Phase 6 — Iteration

Release updates based on observed behaviour.

## Phase 7 — Competition Polish

Improve:

- Animations
- Onboarding
- Paywall
- Store listing
- Performance
- Retention

## Phase 8 — Submission

Prepare:

- Two-minute video
- Screenshots
- Devpost copy
- Growth statistics
- Build-in-public story

---

# 18. Scope Rule

Every proposed feature should pass at least one of these tests:

1. Does it substantially improve the core user value?
2. Does it improve retention?
3. Does it improve monetisation?
4. Does it materially strengthen one of our target Shipaton awards?
5. Does it increase our ability to demonstrate the product?

If the answer to all five is **no**, the feature should probably not be built before Shipaton.

---

# 19. Definition of Done

The entry is complete only when:

- [ ] Brand-new Android app is publicly available on Google Play.
- [ ] Initial public release occurred between 1 August and 30 September 2026.
- [ ] RevenueCat production SDK is integrated.
- [ ] At least one real in-app purchase/subscription works.
- [ ] Premium entitlements are correctly enforced.
- [ ] Restore-purchase flow works.
- [ ] Free trial or judge-access mechanism is available.
- [ ] Onboarding is complete.
- [ ] Core workflow is polished.
- [ ] Analytics are operational.
- [ ] Crash reporting is operational.
- [ ] Privacy policy exists.
- [ ] Google Play Data Safety information is correct.
- [ ] Store listing is complete.
- [ ] 1024×1024 Shipaton icon is prepared.
- [ ] Required 1179×2556 screenshot is prepared.
- [ ] Maximum two-minute demo video is published publicly.
- [ ] Devpost description is complete.
- [ ] Google Play URL is supplied.
- [ ] Application behaviour shown in the video matches the actual application.
- [ ] All premium functionality is testable by judges.