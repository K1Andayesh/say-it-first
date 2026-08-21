# Say It First — Codex Product and Implementation Requirements

> **Working title:** Say It First  
> **Internal repository codename:** `say-it-first`  
> **Target:** RevenueCat Shipaton 2026  
> **Primary platform:** Android  
> **Primary category:** Influencer Award — Career Coaching  
> **Secondary categories:** HAMM, RevenueCat Design, #BuildInPublic, OneSignal Keep Them Coming Back, Grand Prize  
> **Document version:** 1.1  
> **Verified against official Shipaton rules:** 2026-08-20  
> **Status:** Two-phase implementation brief for Codex

---

## 0. Instructions to Codex

Treat this document as the product, architecture, compliance, and acceptance-test specification.

### Execution protocol

1. Inspect the repository before changing anything.
2. If the repository is empty, scaffold the monorepo described in this document.
3. Create and maintain:
   - `PLAN.md`
   - `TASKS.md`
   - `docs/architecture.md`
   - `docs/shipaton-compliance.md`
   - `docs/build-in-public-log.md`
   - `.env.example`
4. Implement the two delivery phases in Section 24. Begin with **Phase 1, Checkpoint 1 — realtime technical spike**.
5. Do not proceed beyond the technical spike until the realtime voice path meets its exit criteria or the documented turn-based fallback is deliberately selected.
6. Keep the application runnable after each phase checkpoint.
7. Add tests with each feature. Do not leave all testing until the end.
8. Use current stable package versions compatible with the selected Expo SDK. Do not blindly use versions written in old tutorials.
9. Consult current official documentation for RevenueCat, Expo, Google Play, OneSignal, and the selected AI provider before integrating them.
10. Never commit API keys, private RevenueCat keys, service-account credentials, OneSignal REST keys, database credentials, or signing material.
11. Do not invent unavailable credentials or console configuration. Add clear placeholders and setup instructions instead.
12. Do not silently broaden scope. Record material architecture changes in an ADR.
13. Ask for human input only when blocked by an external account, credential, legal/business decision, package name, final branding, or store-console action.
14. Production and competition-demo builds must not use fake purchases, mock AI responses, fake analytics, or fabricated growth data.
15. If an implementation choice conflicts with an official competition rule, the official rule wins.

---

# 1. Product Summary

## 1.1 Product proposition

> **Practise the difficult workplace conversation before it becomes real.**

Say It First is an Android application for new and first-time managers. It allows a manager to rehearse a difficult workplace conversation with an AI-simulated employee, receive evidence-backed feedback, retry the difficult moments, and build confidence before the real meeting.

## 1.2 Core value statement

A user should understand the application within ten seconds:

> Choose a difficult management conversation, practise it by voice, see what worked, and try again.

## 1.3 Primary audience

- New managers
- First-time team leaders
- Technical leads who recently acquired people-management duties
- Small-business owners managing staff
- Experienced individual contributors moving into leadership
- Managers who lack access to a human coach

## 1.4 Core problem

New managers often know *what* they need to discuss but do not know *how* to say it. They avoid the conversation, over-explain, soften the message until it becomes unclear, become unnecessarily confrontational, or finish without an agreed next step.

Most management content is passive. Say It First provides active rehearsal.

## 1.5 Product boundary

This is a **difficult-conversation rehearsal tool**, not:

- An HR decision engine
- Legal advice
- A performance-management system
- An employee surveillance tool
- A real-conversation recorder
- A generic therapy chatbot
- A generic interview coach
- A dating or social-conversation trainer
- A full leadership course
- A replacement for HR, legal, clinical, or emergency support

---

# 2. Competition Strategy

## 2.1 Primary award target

### Influencer Award — Career Coaching

The product must directly satisfy these judging dimensions:

1. **Realistic scenarios**
   - Conversations must feel relevant to new managers.
   - Employee responses must not be unrealistically cooperative.
   - Scenarios must include plausible organisational context, ambiguity, emotion, and pushback.

2. **Practice and feedback**
   - The user must actively practise, not only read scripts.
   - Feedback must be specific, useful, and linked to the user's actual words.
   - Phase 1 scenarios must include feedback, boundaries, and saying no.

3. **Confidence building**
   - The experience must help the user feel better prepared.
   - Confidence must be measured through explicit pre-practice and post-practice self-rating.
   - Do not claim to infer confidence from voice, facial expression, or biometric signals.

## 2.2 Secondary award targets

### HAMM Award

The product must demonstrate:

- RevenueCat as an integral part of the monetisation system
- A well-crafted contextual paywall
- Thoughtful monthly and annual packaging
- At least one real RevenueCat-powered purchase
- Clear conversion instrumentation
- A monetisation model appropriate to both recurring and urgent use
- Real conversion/revenue evidence where available

### RevenueCat Design Award

The product should demonstrate:

- Distinctive interaction design
- A polished voice-session experience
- Smooth, purposeful animation
- Transcript replay with evidence-linked coaching
- A visually satisfying retry/improvement comparison
- Good typography, motion, spacing, accessibility, and Android behaviour

### #BuildInPublic Award

The project must maintain a public, evidence-based build narrative:

- Product hypotheses
- Technical failures
- User feedback
- Scenario-quality testing
- AI evaluation calibration
- Before/after product changes
- Metrics and lessons
- Links to public posts
- Clear examples of community feedback changing the application

### OneSignal Keep Them Coming Back Award

The product should use OneSignal for a genuinely useful return loop:

> “Your real feedback conversation is tomorrow. Run one final three-minute rehearsal.”

This must be implemented as a real OneSignal campaign or messaging flow, not merely as a local notification labelled as OneSignal.

### Grand Prize

The application must launch early enough to gather real evidence of:

- Installs
- Activated users
- Completed practices
- Repeat practices
- Paying users
- Revenue
- Conversion
- Retention
- User feedback
- Product iterations after launch

The Grand Prize shortlist is influenced by total RevenueCat revenue during the submission period. Therefore, public release and monetisation must not be postponed until the deadline.

## 2.3 Categories deliberately not targeted in V1

- Ship Kotlin Everywhere: Android-only and React Native do not satisfy its cross-platform Kotlin requirements.
- Replit Idea to Income: this project is being built with Codex, not Replit Agent.
- Funnel Vision: not required unless a web-to-app Stripe funnel is intentionally added.
- Best App for Galaxy: not required unless a Galaxy Store release is intentionally added.
- Next Gen: not applicable unless the entrant independently qualifies as a student.

---

# 3. Hard Shipaton Compliance Requirements

These requirements are release blockers.

## COMP-001 — Eligible application

The application must be a working Android application.

## COMP-002 — RevenueCat SDK

The production Android application must integrate the official RevenueCat SDK and use it to power at least one genuine in-app purchase.

For React Native/Expo:

- Use `react-native-purchases`.
- Use `react-native-purchases-ui` where appropriate for RevenueCat Paywalls or Customer Center.
- A custom REST-only purchase integration does **not** satisfy this requirement.
- The mobile application may contain the public RevenueCat Google Play SDK key.
- RevenueCat private API keys must remain server-side.

## COMP-003 — First public release

The application must not have been publicly released on an eligible store before the Shipaton submission period.

The first public store release must occur during the official submission period:

- Opens: 2026-07-31 at 08:00 PDT
- Closes: 2026-09-30 at 23:45 PDT

Use an internal submission deadline of **2026-09-27**.

## COMP-004 — Store

Publish the fully functional app to Google Play and provide a live store URL.

## COMP-005 — United States availability

The app must be downloadable and usable from the United States.

AI services, pricing, purchases, trial eligibility, and core functionality must also work for a US judge.

## COMP-006 — Functional consistency

The published app must:

- Install successfully
- Launch consistently
- Perform the behaviours shown in the video
- Match the claims in the written submission
- Not depend on developer-only switches or local servers

## COMP-007 — Third-party rights

All SDKs, APIs, data, fonts, icons, audio, music, animations, illustrations, and other assets must be used under valid terms and licences.

## COMP-008 — Submission description

Prepare an English text description explaining:

- Problem
- Audience
- Core workflow
- Features
- Technology
- AI approach
- RevenueCat integration
- Monetisation
- Privacy
- Growth and iteration
- Award-specific fit

## COMP-009 — Demonstration video

Prepare a public YouTube or Vimeo video that:

- Is shorter than two minutes
- Shows the app functioning on the Android device/platform for which it was built
- Uses no unauthorised copyrighted music, trademarks, or media
- Shows real application behaviour
- Shows RevenueCat-powered monetisation
- Clearly demonstrates practice, feedback, and confidence building

## COMP-010 — Submission assets

Prepare:

- 1024 × 1024 application icon
- At least one 1179 × 2556 screenshot
- No device frame around the required screenshot
- Google Play URL
- Public demo-video URL

## COMP-011 — Judge premium access

The app must provide either:

- A working free trial, or
- A valid promo code that unlocks all paid features

The access method must remain functional through the judging period.

## COMP-012 — Free testing availability

The app must remain available for judges without restrictive access through the end of judging.

## COMP-013 — English

The application and all submission materials must be available in English.

## COMP-014 — Influencer restriction

The app may enter only one Influencer Award category.

Do **not** use Leadership Heather's:

- Name
- Likeness
- Image
- Voice
- Brand
- Logo
- Other identifying features

in the app, store listing, icon, screenshots, website, demo, or marketing without express written consent.

The Devpost submission may identify the official category by its official category name where required.

## COMP-015 — Award-specific submission evidence

Maintain evidence needed for:

- Career Coaching category fit
- HAMM monetisation strategy and results
- Design decisions and highlighted interactions
- Build-in-public links and product changes
- OneSignal App ID and deployed campaign
- Grand Prize post-launch growth numbers

---

# 4. Product Principles

1. **Practise first, explain second.** The main experience is active rehearsal.
2. **Evidence, not generic encouragement.** Feedback must point to the user's words.
3. **Realistic resistance.** The AI employee must not make every conversation easy.
4. **No false authority.** Feedback is AI-generated coaching, not HR or legal advice.
5. **Privacy by default.** Do not retain raw audio or transcript on the server by default.
6. **One clear job.** Do not expand into a generic life coach.
7. **Fast first value.** A new user should begin a practice within 60 seconds.
8. **Earn the paywall.** Show meaningful value before asking the user to subscribe.
9. **Design supports confidence.** Motion and visualisation should clarify progress, not distract.
10. **Ship early.** A smaller public product with users is more valuable than a broad unpublished build.

---

# 5. Two-Phase Delivery Scope

## 5.1 Delivery rules

This specification is intentionally delivered in two phases. Phasing changes order, not the final product contract.

1. No requirement in this document is removed merely because it is assigned to Phase 2.
2. Phase 1 must be a genuine, stable, monetised public product. It must not use fake purchases, fake AI, developer-only switches, or unfinished placeholder flows.
3. Phase 2 completes the full competition product, award integrations, growth evidence, and submission package before the internal submission deadline.
4. Security, privacy, purchase correctness, data deletion, truthful claims, and release-blocking reliability cannot be deferred from any feature that ships in Phase 1.
5. A Phase 2 feature may be implemented early when it materially reduces risk, but Phase 1 may not expand until its core practice loop is stable.
6. Where a detailed requirement below describes the final six-scenario product, Section 5.4 defines the smaller Phase 1 subset. The remaining behaviour stays mandatory for Phase 2.

## 5.2 Phase 1 — Publishable Core

**Objective:** publish one polished, trustworthy end-to-end management-rehearsal product early enough to collect real usage and revenue.

Required capabilities:

- Android application published to Google Play
- Four-screen-or-shorter onboarding
- Anonymous use with no mandatory account
- Three realistic scenarios covering the official category essentials:
  - Underperformance feedback (`SCN-001`)
  - Say no to an unreasonable request (`SCN-003`)
  - After-hours boundary (`SCN-004`)
- Two employee response styles:
  - Defensive (`PERSONA-001`)
  - Dismissive (`PERSONA-003`)
- Voice roleplay proven on a physical Android device
- Text fallback
- Live transcript
- Pre-practice and post-practice preparedness rating
- Five-dimension feedback grounded in exact transcript evidence
- Strongest moment and most important missed opportunity
- Retry from one highlighted moment
- A concise original-versus-revised comparison for that retry
- Minimal local practice history: open, delete one, and delete all
- Schedule-real-conversation flow using a privacy-safe local reminder
- RevenueCat monthly and annual products
- RevenueCat entitlement and server-side usage enforcement
- Contextual RevenueCat paywall
- Restore-purchase and manage-subscription paths
- Trial or judge access
- Core funnel analytics
- Crash reporting and operational AI-cost/error monitoring
- Privacy controls, disclaimers, and local/server data deletion
- Production AI, billing, and backend infrastructure
- Google Play production release and support path

Phase 1 deliberately optimises for the strongest competition demonstration:

> Practise a difficult conversation, see feedback tied to what you actually said, retry the moment that went wrong, and feel more prepared for the real meeting.

## 5.3 Phase 2 — Competition Expansion and Submission

**Objective:** complete the full product contract, strengthen the target awards, iterate from real users, and submit verified evidence by 2026-09-27.

Required capabilities:

- Add the remaining three scenarios:
  - Missed deadline (`SCN-002`)
  - Behaviour affecting the team (`SCN-005`)
  - Delegation without micromanagement (`SCN-006`)
- Add the anxious employee response style (`PERSONA-002`)
- Validate all six scenarios across all three employee styles
- Pause-and-coach flow
- Retry the complete scenario
- Richer attempt comparison and history search
- Complete the full evaluation golden set and scenario-quality calibration
- OneSignal SDK, identity, permission flow, real campaign/Journey, delivery evidence, and deep links
- Upgrade the scheduled-conversation reminder from local-only to the required OneSignal-supported return loop without duplicate delivery
- Personal communication-pattern summary
- Scenario bookmarking
- Shareable progress card containing no confidential content
- Onboarding and paywall experiment
- Growth acquisition, feedback collection, retention work, and public iteration
- Full physical-device, billing, notification, accessibility, security, and regression matrices
- Competition design-polish pass
- Store-listing iteration
- Final Devpost copy, icon, screenshot, judge access, public two-minute video, compliance evidence, and submission

Optional Phase 2 capabilities, only after all required work is stable:

- One-off urgent practice pack
- Optional cloud sync
- Optional account upgrade
- Additional scenarios or employee styles beyond the required six-by-three catalogue

## 5.4 Requirement traceability

| Requirement group | Phase 1 obligation | Phase 2 completion |
|---|---|---|
| `COMP-001`–`COMP-014` | Satisfy every requirement needed for an eligible public Google Play release, real RevenueCat purchase, truthful product, and judge-testable build. Submission-only assets may be draft. | Finalise submission assets, judge instructions, and all award evidence. |
| `COMP-015` | Create evidence structure and start recording evidence. | Complete Career Coaching, HAMM, Design, Build in Public, OneSignal, and growth evidence. |
| `SCN-001`–`SCN-006` | Ship `SCN-001`, `SCN-003`, and `SCN-004`. | Add `SCN-002`, `SCN-005`, and `SCN-006`; validate all six. |
| `PERSONA-001`–`PERSONA-003` | Ship defensive and dismissive. | Add anxious; validate all three against all scenarios. |
| `FR-001`–`FR-007` | Implement for the Phase 1 scenario/persona subset. | Extend and calibrate for the complete catalogue. |
| `FR-008` | Provider boundary may exist; user-facing pause coaching is deferred. | Implement and validate the complete pause-and-coach flow. |
| `FR-009`–`FR-012` | Implement completely for every Phase 1 practice. | Calibrate quality across the expanded catalogue. |
| `FR-013` | Implement highlighted-moment retry and a concise comparison. | Add full-scenario retry and richer attempt comparison. |
| `FR-014` | Open history; delete one; delete all. | Add scenario-title search and richer history insights. |
| `FR-015`–`FR-016` | Schedule the real conversation with a privacy-safe local reminder and deep link. | Replace/augment with the required OneSignal flow and prevent duplicate delivery. |
| `FR-017`–`FR-019` | Implement completely before public release. | Experiment and polish without weakening correctness. |
| `AI-001`–`AI-006`, `AI-008`–`AI-009` | Implement completely for shipped flows. | Harden and tune using production evidence. |
| `AI-007` | Run a representative release set covering strong, weak, aggressive, mixed, insufficient, and safety-sensitive cases. | Complete the full 50-transcript golden set and all specified measurements. |
| `RC-001`–`RC-009` | Implement and production-test completely. | Retest after every material paywall or packaging change. |
| `RC-010` | Capture all required experiment-ready events. | Run and document at least one responsible paywall/onboarding experiment when traffic permits. |
| `OS-001`–`OS-006` | Preserve compatible identity and reminder boundaries; do not claim OneSignal delivery yet. | Implement completely and record real campaign evidence. |
| `PRIV-001`–`PRIV-008`, `SEC-001`–`SEC-004` | Apply completely to every shipped path. | Re-audit the expanded paths and final release. |
| UX, architecture, state, data, API, analytics, and NFR sections | Implement the portions required by the Phase 1 feature set without disposable shortcuts that block Phase 2. | Complete every remaining behaviour and final polish. |
| Testing section | Pass core unit/API/contract/E2E, physical voice, purchase, restore, failure, privacy, and release gates. | Complete the full specified regression and physical-device matrices. |
| Release and store section | Publish Phase 1 and make it genuinely usable in the United States. | Publish the competition update and finalise the submission package. |

## 5.5 Explicit non-goals

Do not build before submission unless all release blockers are complete:

- Video avatars
- Human-looking 3D avatars
- Camera access
- Emotion recognition
- Voice-stress analysis
- Facial analysis
- Real employee recording
- Employer administration portal
- HRIS integrations
- Slack or Teams integration
- Company policy ingestion
- Human coach marketplace
- Certificates
- Full leadership curriculum
- Multiple languages
- iOS
- Web application
- Samsung-specific optimisation
- Social network
- Public transcript sharing

---

# 6. Core User Journeys

## Journey A — First practice

1. User installs and opens the app.
2. User sees a concise value proposition.
3. User acknowledges that the app is AI coaching, not HR/legal advice.
4. User chooses a scenario.
5. User chooses an employee response style.
6. User optionally adds short, non-identifying context.
7. User rates current confidence from 1 to 5.
8. User grants microphone permission at the moment it becomes necessary.
9. User conducts a three-to-five-minute voice practice.
10. User ends the practice.
11. App generates structured feedback.
12. User sees:
    - Strongest moment
    - Most important missed opportunity
    - Five scores
    - Evidence-linked transcript highlights
    - One suggested next sentence
13. User rates confidence again.
14. User retries or saves the session.
15. After value is demonstrated, the app may display a contextual paywall.

## Journey B — Retry difficult moment

1. User opens a completed evaluation.
2. User selects a highlighted moment.
3. App explains the challenge in one sentence.
4. AI resumes from immediately before that moment.
5. User tries a revised response.
6. App compares the revised response with the original.
7. App shows specific improvement or remaining issue.

## Journey C — Prepare for a real meeting

1. User creates or completes a practice.
2. User chooses “Schedule the real conversation.”
3. User enters date/time and a generic label.
4. App requests notification permission contextually.
5. Phase 1 schedules a privacy-safe local reminder; Phase 2 upgrades this to the required OneSignal-supported reminder flow.
6. User opens the notification.
7. App opens directly to a short final rehearsal.

## Journey D — Purchase Pro

1. User reaches a meaningful limit or requests a premium capability.
2. App explains the benefit in context.
3. RevenueCat paywall displays live localised packages.
4. User selects monthly or annual.
5. Purchase is initiated through the RevenueCat SDK.
6. CustomerInfo is refreshed.
7. The `pro` entitlement is checked.
8. Pro capability unlocks immediately.
9. Purchase state remains correct after restart and reinstall/restore.

## Journey E — Recover from failure

The app must gracefully handle:

- Microphone denied
- AI connection failure
- Network interruption
- App backgrounding
- Audio route change
- Purchase cancellation
- Purchase pending
- Purchase already owned
- RevenueCat unavailable
- OneSignal permission denied
- Evaluation timeout
- Corrupt local session
- Server rate limit

In every case, preserve user work where possible and provide a clear next action.

---

# 7. Scenarios

## 7.1 Required scenarios by delivery phase

### SCN-001 — Underperformance feedback

**Delivery:** Phase 1

A team member's work has repeatedly missed an agreed quality or output standard.

Key skills:

- State the gap clearly
- Use concrete examples
- Avoid attacking identity
- Listen to context
- Agree on next steps

### SCN-002 — Missed deadline

**Delivery:** Phase 2

A team member missed an important deadline and did not communicate early.

Key skills:

- Address impact
- Avoid blame escalation
- Establish communication expectations
- Agree on recovery plan

### SCN-003 — Say no to an unreasonable request

**Delivery:** Phase 1

A team member asks for an exception the manager cannot reasonably grant.

Key skills:

- Say no clearly
- Acknowledge the need
- Avoid lengthy defensive explanation
- Offer legitimate alternatives where possible

### SCN-004 — After-hours boundary

**Delivery:** Phase 1

A team member repeatedly messages or expects decisions outside agreed working boundaries.

Key skills:

- Set boundary
- Explain emergency exception
- Maintain respect
- Agree on future channel and timing

### SCN-005 — Behaviour affecting the team

**Delivery:** Phase 2

A capable employee frequently interrupts, dismisses, or dominates colleagues.

Key skills:

- Describe observable behaviour
- Explain impact
- Invite perspective
- Set behavioural expectation

### SCN-006 — Delegation without micromanagement

**Delivery:** Phase 2

A manager needs to delegate an important task while retaining accountability.

Key skills:

- Define outcome
- Define constraints
- Clarify authority
- Agree on check-ins
- Avoid prescribing every step

## 7.2 Employee response styles

### PERSONA-001 — Defensive

**Delivery:** Phase 1

- Challenges the manager's examples
- Explains external causes
- May perceive unfairness
- Responds better to specificity and listening

### PERSONA-002 — Anxious

**Delivery:** Phase 2

- Worries about consequences
- May over-apologise
- Needs clarity without false reassurance
- Responds better to calm structure

### PERSONA-003 — Dismissive

**Delivery:** Phase 1

- Minimises the issue
- May redirect or change the subject
- Tests whether the manager will maintain the boundary
- Responds better to concise repetition and clear next steps

## 7.3 Scenario data model

Each scenario definition must contain:

```ts
type ScenarioDefinition = {
  id: string;
  version: number;
  title: string;
  shortDescription: string;
  category:
    | "feedback"
    | "boundaries"
    | "saying_no"
    | "accountability"
    | "delegation";
  difficulty: "starter" | "intermediate" | "advanced";
  context: string;
  userRole: string;
  employeeRole: string;
  userGoal: string;
  hiddenEmployeeGoal: string;
  facts: string[];
  ambiguity: string[];
  successSignals: string[];
  failurePatterns: string[];
  prohibitedEscalations: string[];
  recommendedDurationSeconds: number;
};
```

Scenario content must be versioned so evaluation results remain interpretable after scenario changes.

---

# 8. Functional Requirements

## FR-001 — Onboarding

Onboarding must:

- Use no more than four screens before the home screen
- Explain the active-practice value
- Explain privacy at a high level
- Explain that feedback is AI-generated
- Avoid requesting notification permission
- Avoid requesting microphone permission until starting voice practice
- Permit immediate use without account creation

Acceptance criteria:

- A first-time user can begin scenario selection within 30 seconds.
- A first-time user can begin practice within 60 seconds.
- The user can skip non-essential educational content.

## FR-002 — Anonymous identity

On first launch:

1. Generate a cryptographically random UUID.
2. Store it in secure device storage.
3. Use it as the stable anonymous application user ID.
4. Use the same ID for:
   - Backend anonymous identity
   - RevenueCat `appUserID`
   - OneSignal external ID
5. Do not use advertising ID, IMEI, phone number, contacts, or account email.

Acceptance criteria:

- Identity survives normal app restarts.
- No personally identifying information is required.
- A “Delete my data” action removes local data and requests server deletion.

## FR-003 — Scenario catalogue

The catalogue must:

- Show the three Phase 1 scenarios in the public core release
- Show all six required scenarios after Phase 2 expansion
- Group or filter by skill
- Explain expected duration
- Explain difficulty
- Indicate free or Pro availability
- Open quickly from home

## FR-004 — Scenario setup

The user can:

- Select a scenario
- Select employee response style
- Add optional context with a strict character limit
- Avoid entering names or confidential details through visible guidance
- Choose voice or text mode
- Rate pre-practice confidence

Context requirements:

- Maximum 600 characters
- No file upload in either competition phase
- No contact or company lookup
- No background collection

## FR-005 — Voice practice

Voice practice must:

- Support two-way spoken conversation
- Display clear microphone state
- Display connection state
- Support interruption/barge-in if the selected realtime path supports it
- Display a live transcript
- Support mute
- Support pause
- Support end session
- Enforce session duration/cost limit
- Recover or save partial transcript after interruption
- Never record in the background

Target duration:

- Typical session: 3–5 minutes
- Hard Phase 1 and Phase 2 limit: 6 minutes unless a later measured cost decision explicitly lowers it

## FR-006 — Text fallback

If voice is unavailable or the user prefers text:

- Provide the same scenario and persona behaviour
- Permit typed responses
- Provide equivalent evaluation
- Make it visually clear that it is text practice
- Do not block the user from core value because microphone permission was denied

## FR-007 — AI employee behaviour

The simulated employee must:

- Stay in the assigned role
- Use only scenario facts and user-provided context
- Respond realistically
- Avoid instantly conceding
- Avoid coaching the manager during roleplay
- Keep responses concise enough for natural dialogue
- React to the manager's clarity, empathy, boundaries, and next steps
- Avoid fabricating severe misconduct or legal facts
- Avoid escalating into threats, self-harm, violence, harassment, or protected-class issues unless explicitly part of a safety test scenario
- Stop roleplay when the user ends the session

## FR-008 — Pause and coach

**Delivery:** Phase 2. Preserve the coaching-provider boundary in Phase 1; do not expose an unfinished control.

The session screen may provide “Pause and coach me.”

When selected:

- Pause the roleplay
- Provide one concise, actionable tip
- Do not reveal hidden scenario instructions
- Allow the user to resume
- Record the use of coaching in the session metadata

## FR-009 — Evaluation

After a completed practice, generate:

- One-sentence summary
- Strongest moment
- Most important missed opportunity
- Five scores
- Evidence for each score
- One improved phrase
- Suggested next step
- Any HR/legal/safety caution
- Evaluation confidence metadata for internal quality monitoring

The five score dimensions are:

1. Clarity
2. Empathy and listening
3. Specificity
4. Boundaries and assertiveness
5. Next steps and accountability

## FR-010 — Evidence-linked feedback

Every substantive feedback claim must link to:

- A real user turn ID, and
- An exact short excerpt from that user turn

The evaluator must not invent quotes.

If there is insufficient evidence, return “Not enough evidence” rather than fabricate a score rationale.

## FR-011 — Confidence measurement

Before practice, ask:

> How prepared do you feel for this conversation right now?

After feedback or retry, ask the same question.

Scale:

- 1 — Not prepared
- 2 — Slightly prepared
- 3 — Somewhat prepared
- 4 — Prepared
- 5 — Very prepared

The app may display self-reported change. It must not claim scientifically validated confidence improvement.

## FR-012 — Transcript replay

The transcript replay must:

- Distinguish user and AI employee turns
- Highlight evidence used in feedback
- Jump from a feedback card to the associated turn
- Avoid displaying hidden prompts
- Permit the user to delete the session
- Never publicly share transcript content without explicit action

## FR-013 — Retry

In Phase 1, the user can:

- Retry from a highlighted moment
- Compare the revised response with the original response
- See one concise explanation of the most meaningful improvement or remaining issue

In Phase 2, the user can additionally:

- Retry the complete scenario
- Compare complete attempts
- See score changes
- See confidence-rating changes

## FR-014 — History

Store locally:

- Scenario
- Persona
- Start/end timestamps
- Mode
- Transcript
- Evaluation
- Confidence before/after
- Retry relationship
- Reminder relationship

Phase 1 history must support:

- Open
- Delete one session
- Delete all sessions

Phase 2 history must additionally support:

- Search by scenario title
- Personal communication-pattern insights that do not overstate scientific validity

## FR-015 — Schedule real conversation

The user can save:

- Generic title
- Date/time
- Related practice session
- Reminder preferences

Do not require or encourage entry of:

- Employee full name
- Employee email
- Company confidential information
- Medical information
- Protected-class information

Delivery:

- Phase 1 schedules a local, privacy-safe reminder and deep link.
- Phase 2 implements the OneSignal-supported reminder workflow and competition evidence.

## FR-016 — Notifications

Notification permission must be requested only after the user schedules a real conversation or explicitly enables reminders in settings.

Notifications must:

- Be useful
- Respect local time
- Deep-link to the relevant practice
- Avoid confidential text on the lock screen
- Use a generic default message
- Avoid duplicate local and OneSignal delivery

In Phase 1, these requirements apply to local notifications. In Phase 2, they apply to the OneSignal-supported flow, including migration or cancellation of any overlapping local schedule.

## FR-017 — Paywall

The paywall must:

- Appear only after value has been shown or a premium action is selected
- Display live localised product names and prices from RevenueCat
- Clearly distinguish monthly and annual plans
- Explain what remains free
- Explain usage limits honestly
- Include restore purchases
- Include terms and privacy links
- Avoid false countdowns, false scarcity, or misleading savings claims
- Highlight annual value only when mathematically accurate

## FR-018 — Subscription state

The app must correctly handle:

- New purchase
- User cancellation during flow
- Pending purchase
- Purchase failure
- Existing entitlement
- Expired entitlement
- Billing grace period where reported
- Restore purchases
- App restart
- Offline cached state
- CustomerInfo refresh
- Subscription management link

## FR-019 — Settings and privacy

Settings must include:

- Notification settings
- Audio preferences
- Data retention explanation
- Delete local practice history
- Delete account/server data
- Restore purchases
- Manage subscription
- Privacy policy
- Terms
- AI coaching disclaimer
- App version
- Contact/support path

---

# 9. AI Requirements

## AI-001 — Provider abstraction

Do not tightly couple domain logic to one model vendor.

Implement interfaces similar to:

```ts
interface RoleplayProvider {
  startSession(input: StartRoleplayInput): Promise<RoleplaySessionDescriptor>;
  endSession(sessionId: string): Promise<void>;
}

interface EvaluationProvider {
  evaluate(input: EvaluatePracticeInput): Promise<PracticeEvaluation>;
}

interface CoachingProvider {
  getPauseTip(input: PauseTipInput): Promise<PauseTip>;
}
```

The production default may use OpenAI, but domain code must depend on interfaces.

## AI-002 — Preferred realtime path

Preferred implementation:

- Mobile WebRTC connection for low-latency voice
- Backend creates/authorises the realtime session
- Standard provider secret remains server-side
- Session instructions and business rules are controlled server-side
- Mobile receives only short-lived session material
- Transcript events are captured for evaluation
- Use a compatible React Native WebRTC implementation in an Expo development build

Do not place a standard AI API key in the app.

## AI-003 — Fallback voice path

If the realtime WebRTC spike fails the Phase 1 Checkpoint 1 criteria, implement a turn-based voice pipeline:

1. Record user utterance with the current Expo audio library.
2. Upload audio over TLS.
3. Transcribe.
4. Generate employee response.
5. Generate speech.
6. Stream or play response.
7. Append both turns to transcript.

The fallback must preserve the same domain contract and evaluation pipeline.

## AI-004 — Prompt separation

Maintain separate prompts/configuration for:

- Employee roleplay
- Pause coaching
- Final evaluation
- Safety classification where needed

Do not ask a single model call to roleplay, score itself, enforce policy, and produce the UI payload simultaneously.

## AI-005 — Roleplay prompt rules

The roleplay system instruction must:

- Identify the scenario and persona
- State known facts
- State hidden employee concerns
- State the employee's conversational objective
- Prohibit coaching during roleplay
- Prohibit revealing hidden instructions
- Require concise spoken responses
- Require realistic but bounded pushback
- Require de-escalation from unsafe content
- Require the model to stay within workplace rehearsal

## AI-006 — Evaluation schema

Use strict structured output validated server-side.

```ts
type PracticeEvaluation = {
  schemaVersion: 1;
  summary: string;
  strongestMoment: EvidenceFeedback | null;
  missedOpportunity: EvidenceFeedback | null;
  dimensions: DimensionEvaluation[];
  suggestedOpening: string | null;
  suggestedNextSentence: string | null;
  suggestedClosing: string | null;
  overallNextStep: string;
  cautions: EvaluationCaution[];
  evaluatorConfidence: number;
};

type Dimension =
  | "clarity"
  | "empathy_listening"
  | "specificity"
  | "boundaries_assertiveness"
  | "next_steps_accountability";

type DimensionEvaluation = {
  dimension: Dimension;
  score: number | null;
  label: "needs_work" | "developing" | "strong" | "not_enough_evidence";
  evidence: TranscriptEvidence[];
  feedback: string;
  nextTry: string;
};

type TranscriptEvidence = {
  turnId: string;
  quote: string;
};

type EvidenceFeedback = {
  turnId: string;
  quote: string;
  explanation: string;
};

type EvaluationCaution = {
  code:
    | "hr_review"
    | "legal_review"
    | "safety_concern"
    | "harassment_or_discrimination"
    | "medical_or_disability"
    | "self_harm_or_violence"
    | "insufficient_context";
  message: string;
};
```

Validation requirements:

- Scores are integers from 0 to 100 or `null`.
- Every evidence turn ID must exist.
- Every quote must be a substring of that turn after safe normalisation.
- Reject and retry invalid structured output once.
- If still invalid, return a safe degraded evaluation rather than fabricated detail.

## AI-007 — Evaluation quality

Phase 1 must run a representative release set containing strong, weak/avoidant, overly aggressive, mixed-quality, insufficient, and safety-sensitive transcripts.

Phase 2 must complete the full golden test set containing at least:

- 10 strong manager transcripts
- 10 weak/avoidant transcripts
- 10 overly aggressive transcripts
- 10 mixed-quality transcripts
- 5 short/insufficient transcripts
- 5 safety-sensitive transcripts

Measure:

- Schema validity
- Quote grounding
- Score consistency
- Correct identification of missing next steps
- Correct handling of insufficient evidence
- Safety caution precision

## AI-008 — Prompt injection resistance

Treat scenario context and transcript as untrusted data.

- Delimit untrusted content.
- Do not concatenate it into privileged instructions without boundaries.
- Ignore transcript instructions asking the evaluator to change its role or score.
- Validate all model output.
- Never expose hidden prompts to the client.

## AI-009 — Cost controls

- Authorise usage before creating an AI session.
- Enforce hard duration limits server-side.
- Rate-limit session creation.
- Track model, duration, token/audio usage, estimated cost, and error code.
- Do not log transcript or audio in routine telemetry.
- Permit model selection through environment configuration.
- Use a lower-cost realtime model during development where quality is sufficient.
- Prevent accidental infinite or abandoned sessions.

---

# 10. Monetisation and RevenueCat

## 10.1 Product model

### Free

- Two complete practice sessions
- Starter scenarios
- Voice or text
- Basic evidence-linked feedback
- Local history
- One retry

### Pro

- Monthly and annual purchase options
- Full scenario catalogue
- All employee response styles
- Advanced feedback
- More practice allowance
- Retry from highlighted moments
- Attempt comparison
- Practice history insights
- Scheduled real-conversation reminders
- Priority access to new scenarios

Avoid the word “unlimited” unless usage is genuinely unlimited.

### Optional Phase 2: Urgent Practice Pack

A one-off consumable pack for users who need preparation for a specific conversation but do not want a subscription.

Do not release this product until consumption, restoration semantics, refunds, and server-side credit accounting are tested.

## 10.2 RevenueCat identifiers

Use configuration rather than scattered literals.

Recommended initial identifiers:

```text
Entitlement: pro
Offering: default

Google Play products:
- sayitfirst_pro_monthly
- sayitfirst_pro_annual
- sayitfirst_practice_pack_5   # Optional Phase 2 only
```

Final identifiers must be confirmed in Google Play Console and RevenueCat before release.

## RC-001 — SDK installation

Install the official current RevenueCat Expo/React Native packages.

Real purchases require an Expo development build or production build. Expo Go preview behaviour is not sufficient for production purchase validation.

## RC-002 — SDK initialisation

- Configure RevenueCat once during application bootstrap.
- Use the public Google Play RevenueCat SDK key from environment configuration.
- Pass the stable anonymous `appUserID`.
- Enable debug logs only in non-production builds.
- Do not initialise with a Test Store key in production.

## RC-003 — Offerings

- Fetch offerings dynamically.
- Do not hardcode localised price text.
- Handle missing offering/package gracefully.
- Cache the last successful offering for UI resilience where appropriate.
- Refresh before purchase.

## RC-004 — Entitlements

Premium access must derive from RevenueCat CustomerInfo:

```ts
const isPro = customerInfo.entitlements.active["pro"] !== undefined;
```

Encapsulate this logic in one billing service. Do not scatter entitlement checks across components.

## RC-005 — Purchase flow

For each purchase:

1. Track purchase initiation.
2. Invoke RevenueCat SDK purchase.
3. Distinguish cancellation from failure.
4. Refresh CustomerInfo.
5. Confirm `pro` entitlement.
6. Update application state.
7. Notify backend entitlement cache where required.
8. Track success or failure without sensitive billing data.

## RC-006 — Restore

Provide a visible Restore Purchases action on:

- Paywall
- Settings

Show a clear result:

- Restored and unlocked
- Nothing to restore
- Network/error with retry

## RC-007 — Subscription management

Provide a supported Google Play subscription-management path or RevenueCat Customer Center where available and stable.

## RC-008 — Server-side enforcement

The backend must not trust a boolean supplied by the client.

For AI usage authorisation:

- Use RevenueCat webhooks and/or current official server API verification.
- Cache entitlement status with a short freshness window.
- Refresh when stale, after purchase, or after restore.
- Make webhook processing idempotent.
- Verify webhook authenticity using the configured shared secret/auth mechanism.
- Store event IDs to prevent duplicate processing.

## RC-009 — Trial/judge access

Before submission, configure and test one of:

- A free trial on an eligible Google Play subscription offer, or
- A judge promo code that unlocks all premium features

Document exact testing instructions in `docs/shipaton-compliance.md`.

## RC-010 — Paywall experiment readiness

Instrument:

- Paywall source
- Offering ID
- Package displayed
- Package selected
- Purchase initiated
- Purchase cancelled
- Purchase completed
- Purchase failed
- Trial started where observable
- Entitlement activated

Do not expose private RevenueCat data in analytics.

---

# 11. OneSignal Requirements

## OS-001 — SDK

Integrate the official OneSignal Expo/React Native SDK in an Expo development build and production build.

Push notifications must not be considered tested in Expo Go.

## OS-002 — Identity

Set the OneSignal external ID to the stable anonymous application user ID.

## OS-003 — Permission timing

Request notification permission only after:

- The user schedules a real conversation, or
- The user intentionally enables reminders in settings

Explain the benefit before the OS prompt.

## OS-004 — Campaign

Create and deploy at least one real OneSignal campaign or messaging flow.

Recommended flow:

- Event: user schedules a real conversation
- Message: generic, privacy-safe reminder
- Timing: approximately 24 hours before
- Deep link: final rehearsal for the associated scenario
- Optional second message: approximately one hour before, only if the user enabled it

## OS-005 — Privacy-safe content

Default lock-screen message:

> Your planned conversation is coming up. Run a short rehearsal.

Do not include:

- Employee name
- Performance issue
- Company name
- Confidential context
- Transcript excerpt

## OS-006 — Competition evidence

Record in `docs/shipaton-compliance.md`:

- OneSignal App ID
- Campaign/Journey name
- Trigger
- Screenshots
- Test result
- Notification-open deep link
- Description for Devpost

---

# 12. Privacy, Safety, and Trust

## PRIV-001 — Minimal data collection

Do not require:

- Email
- Name
- Employer
- Employee identity
- Contacts
- Calendar access
- Bank information
- Advertising ID

## PRIV-002 — Audio

- Capture microphone only during an active user-visible practice.
- Never record in the background.
- Do not persist raw audio by default.
- If temporary server buffering is technically necessary, delete it immediately after processing.
- Do not include audio content in logs.

## PRIV-003 — Transcript storage

Default:

- Store transcripts locally on the user's device.
- Send transcript to backend only for evaluation.
- Do not persist transcript server-side after response unless the user explicitly opts into a future cloud feature.
- Exclude transcript and custom context from analytics and crash breadcrumbs.

## PRIV-004 — User warning

Before custom context input, display:

> Do not enter real names, confidential company information, medical details, or other sensitive personal information.

## PRIV-005 — Advice boundary

Display:

> Say It First provides AI-generated communication practice, not legal, HR, medical, or mental-health advice.

## PRIV-006 — Sensitive situations

If input suggests:

- Harassment
- Discrimination
- Retaliation
- Threats
- Violence
- Self-harm
- Medical/disability accommodation
- Illegal activity
- Formal disciplinary or termination action

the app must:

- Avoid definitive legal/HR instruction
- Recommend consulting qualified HR/legal/safety support as applicable
- Preserve the user's ability to practise neutral communication
- Avoid simulating dangerous escalation

## PRIV-007 — Deletion

The user must be able to:

- Delete one practice
- Delete all local practices
- Delete reminders
- Request deletion of server-side anonymous data
- Reset the application identity after confirmation

## PRIV-008 — Logging

Never log:

- Raw audio
- Transcript
- Custom scenario context
- Purchase receipt/token
- API secret
- Private RevenueCat key
- OneSignal REST key
- User-entered employee details

---

# 13. UX and Visual Direction

## 13.1 Tone

- Calm
- Professional
- Human
- Direct
- Premium
- Non-judgmental
- Not corporate-training software
- Not playful in a way that trivialises difficult conversations

## 13.2 Visual concept

Use an abstract animated conversational presence rather than a realistic human avatar.

Possible elements:

- Soft animated orb
- Voice waveform
- Turn-taking state
- Persona-state indicator
- Progress ring
- Subtle tension/release motion
- Haptic confirmation
- Transcript highlights that animate into feedback cards

Do not claim the visualisation detects the user's emotional state.

## 13.3 Session states

The session UI must visibly distinguish:

- Connecting
- AI speaking
- User speaking
- Listening
- Paused
- Muted
- Reconnecting
- Ending
- Failed

## 13.4 Feedback screen hierarchy

Show in this order:

1. One-sentence outcome
2. Strongest moment
3. Most important improvement
4. Five score summary
5. Suggested next sentence
6. Transcript evidence
7. Retry action
8. Confidence self-rating
9. Schedule real conversation
10. History/save

## 13.5 Motion

Motion must be:

- Purposeful
- Smooth
- Interruptible
- Respectful of reduced-motion settings
- Free of long blocking sequences

Potential showcase animation:

- Original and retry score cards align
- Improved dimensions rise
- Evidence excerpt morphs into the revised phrase
- Self-reported confidence change appears separately

## 13.6 Android behaviour

- Correct system back navigation
- Gesture navigation compatibility
- Safe-area handling
- Dark and light modes where feasible
- Keyboard avoidance
- Proper status/navigation-bar appearance
- No iOS-only interaction conventions
- Support common phone sizes
- Portrait-first
- Tablet optimisation is not a Phase 1 requirement, but the app must not be unusable on a tablet

## 13.7 Accessibility

- Screen-reader labels
- Logical focus order
- Minimum touch targets
- Sufficient contrast
- Dynamic text without truncating critical actions
- Transcript available for all audio
- Haptic feedback is never the only signal
- Reduced-motion support
- Error messages describe recovery action

---

# 14. Recommended Technical Architecture

## 14.1 Repository structure

Use a TypeScript monorepo:

```text
/
├─ apps/
│  ├─ mobile/                 # Expo React Native Android app
│  └─ api/                    # Fastify TypeScript API
├─ packages/
│  ├─ contracts/              # Shared Zod schemas and TypeScript types
│  ├─ config/                 # Shared lint/tsconfig where useful
│  └─ domain/                 # Pure domain logic where useful
├─ docs/
│  ├─ architecture.md
│  ├─ shipaton-compliance.md
│  ├─ build-in-public-log.md
│  ├─ privacy-data-map.md
│  └─ adr/
├─ PLAN.md
├─ TASKS.md
├─ pnpm-workspace.yaml
└─ .env.example
```

Use `pnpm` workspaces unless the existing repository already uses a different package manager.

## 14.2 Mobile

Recommended:

- React Native
- Expo
- TypeScript strict mode
- Expo Router
- Expo development builds and EAS Build
- React Native Reanimated
- React Native Skia only if it materially improves the showcase visual
- `expo-audio` for non-WebRTC recording/playback and fallback
- `expo-sqlite` for local session storage
- `expo-secure-store` for anonymous identity and sensitive local tokens
- TanStack Query for server state
- Zustand or a small explicit state machine for app/session state
- Zod for boundary validation
- Sentry for crash reporting
- RevenueCat official React Native packages
- OneSignal official Expo/React Native package

Avoid introducing a large UI kit that makes the app look generic.

## 14.3 API

Recommended:

- Node.js
- Fastify
- TypeScript strict mode
- Zod or TypeBox validation
- PostgreSQL
- Drizzle ORM
- JOSE for signed anonymous access token
- Pino structured logs
- OpenAPI generation
- Idempotent webhooks
- Rate limiting
- Health/readiness endpoints

## 14.4 Deployment

Deploy API to an Ubuntu-hosted environment or a reliable managed platform.

Production requirements:

- HTTPS
- Secret management
- PostgreSQL backups
- Health monitoring
- Structured logs
- Restart policy
- CORS restricted to expected clients where applicable
- No dependency on a developer workstation
- Region/latency appropriate for target users and US judges

## 14.5 Architecture boundaries

Use these logical modules:

```text
Identity
Scenario Catalogue
Practice Session
Realtime Roleplay
Transcript
Evaluation
History
Usage and Quotas
Billing and Entitlements
Reminder Scheduling
Notifications
Analytics
Privacy and Deletion
```

UI components must not call RevenueCat, OneSignal, database, or AI APIs directly. Route through services/use cases.

---

# 15. State Machines

## 15.1 Practice session state

```text
idle
  → authorising
  → connecting
  → ready
  → active
  ↔ paused
  → ending
  → evaluating
  → completed

Failure branches:
authorising → blocked
connecting → connection_failed
active → interrupted
evaluating → evaluation_failed
```

Rules:

- Only one active practice session at a time.
- Session end is idempotent.
- App backgrounding must not silently leave a billable AI session running.
- Timeout must close the provider session server-side.
- Partial transcript must be recoverable after interruption where possible.

## 15.2 Purchase state

```text
idle
  → loading_offering
  → ready
  → purchasing
  → completed

Alternatives:
purchasing → cancelled
purchasing → pending
purchasing → failed
loading_offering → unavailable
```

---

# 16. Local Data Model

Use SQLite migrations.

## 16.1 Tables

### `app_identity`

- `id`
- `created_at`
- `reset_at`

### `practice_sessions`

- `id`
- `scenario_id`
- `scenario_version`
- `persona_id`
- `mode`
- `status`
- `started_at`
- `ended_at`
- `duration_seconds`
- `confidence_before`
- `confidence_after`
- `parent_session_id`
- `retry_from_turn_id`
- `created_at`
- `updated_at`

### `transcript_turns`

- `id`
- `practice_session_id`
- `sequence`
- `speaker`
- `text`
- `started_at_ms`
- `ended_at_ms`
- `created_at`

### `evaluations`

- `id`
- `practice_session_id`
- `schema_version`
- `json_payload`
- `created_at`

### `reminders`

- `id`
- `practice_session_id`
- `generic_title`
- `scheduled_for`
- `timezone`
- `onesignal_reference`
- `status`
- `created_at`
- `updated_at`

### `app_settings`

- `key`
- `json_value`
- `updated_at`

## 16.2 Local encryption

Do not falsely claim full database encryption unless it is actually implemented and verified.

At minimum:

- Store identity/token in SecureStore.
- Avoid OS backups for sensitive local data where configurable.
- Document local storage behaviour in privacy policy.

---

# 17. Backend Data Model

The backend must not store transcript or raw audio by default.

## 17.1 Tables

### `anonymous_users`

- `id`
- `created_at`
- `deleted_at`
- `last_seen_at`

### `usage_ledger`

- `id`
- `user_id`
- `kind`
- `amount`
- `practice_session_id`
- `model`
- `created_at`

### `entitlement_snapshots`

- `user_id`
- `is_pro`
- `source`
- `expires_at`
- `checked_at`
- `updated_at`

### `revenuecat_webhook_events`

- `event_id`
- `event_type`
- `user_id`
- `received_at`
- `processed_at`
- `payload_hash`
- `processing_status`

Do not retain full webhook payload longer than necessary unless required for debugging and documented.

### `reminder_jobs`

- `id`
- `user_id`
- `practice_session_id`
- `scheduled_for`
- `timezone`
- `onesignal_external_id`
- `status`
- `provider_reference`
- `created_at`
- `updated_at`

### `ai_request_metrics`

- `id`
- `user_id`
- `practice_session_id`
- `operation`
- `provider`
- `model`
- `duration_ms`
- `input_units`
- `output_units`
- `estimated_cost`
- `status`
- `error_code`
- `created_at`

No prompt, transcript, custom context, or audio content in this table.

---

# 18. API Contract

All endpoints use versioned paths and validated schemas.

## `POST /api/v1/auth/anonymous`

Purpose:

- Register or resume anonymous identity
- Return short-lived signed access token

Input:

```json
{
  "appUserId": "uuid",
  "appVersion": "string",
  "platform": "android"
}
```

## `GET /api/v1/scenarios`

Returns versioned scenario definitions available to the user.

## `POST /api/v1/practices/authorise`

Checks:

- Rate limit
- Free quota
- Pro entitlement
- Maintenance status
- Maximum concurrent session

Returns authorisation and allowed duration.

## `POST /api/v1/realtime/session`

Preferred WebRTC/unified-session endpoint.

Responsibilities:

- Verify user
- Verify practice authorisation
- Build server-controlled session configuration
- Start/authorise provider session
- Return only the data needed by the mobile client
- Never expose standard provider secret

## `POST /api/v1/practices/:id/end`

Idempotently:

- Ends provider session
- Finalises duration
- Commits usage
- Marks session complete/interrupted

## `POST /api/v1/evaluations`

Input:

- Scenario ID/version
- Persona ID
- Transcript
- Optional custom context
- Coaching-use metadata

Output:

- Validated `PracticeEvaluation`

Do not persist transcript by default.

## `GET /api/v1/usage`

Returns:

- Free sessions remaining
- Pro status
- Current-period usage
- Applicable limits

## `POST /api/v1/reminders`

Creates or updates a privacy-safe reminder and OneSignal scheduling workflow.

## `DELETE /api/v1/users/me`

Deletes or anonymises all server-side data associated with the anonymous user.

## `POST /webhooks/revenuecat`

Requirements:

- Authenticate/verify request using current official RevenueCat mechanism
- Idempotency
- Fast acknowledgement
- Safe retry handling
- Entitlement snapshot update
- No secret logging

## `GET /health/live`

Process is running.

## `GET /health/ready`

Dependencies are available sufficiently for traffic.

---

# 19. Analytics

Implement an analytics adapter so vendors can be changed.

## 19.1 Required events

```text
app_opened
onboarding_started
onboarding_completed
scenario_list_viewed
scenario_selected
persona_selected
custom_context_used
confidence_before_submitted
practice_authorisation_failed
practice_started
practice_connected
practice_paused
pause_coach_used
practice_interrupted
practice_abandoned
practice_completed
evaluation_started
evaluation_completed
evaluation_failed
feedback_viewed
transcript_evidence_opened
retry_started
retry_completed
confidence_after_submitted
real_conversation_scheduled
notification_permission_prompted
notification_permission_result
notification_opened
paywall_viewed
package_selected
purchase_started
purchase_cancelled
purchase_pending
purchase_completed
purchase_failed
restore_started
restore_completed
subscription_management_opened
history_opened
practice_deleted
all_data_deleted
```

## 19.2 Prohibited analytics properties

Never send:

- Transcript text
- Custom context
- Employee name
- Company name
- Raw audio
- Exact generic reminder label if user-entered
- Purchase receipt/token
- API key
- Full IP address if avoidable

## 19.3 Funnel metrics

Calculate:

- Install → onboarding complete
- Onboarding complete → practice started
- Practice started → practice completed
- Practice completed → feedback viewed
- Feedback viewed → retry
- Feedback viewed → paywall
- Paywall → purchase
- Day-1 and Day-7 retention
- Average practices per activated user
- Repeat-practice rate
- Notification opt-in
- Notification open → practice
- Self-reported confidence change
- Revenue and conversion

---

# 20. Reliability and Performance

## NFR-001 — Startup

Target:

- Usable home screen within 2.5 seconds on a representative mid-range Android device after normal warm startup.
- Do not block initial UI on RevenueCat, scenarios, or analytics if cached/local data is available.

## NFR-002 — Voice latency

Phase 1 technical-spike targets:

- Median time from end of user utterance to first audible AI response: ≤ 1.5 seconds
- P95: ≤ 2.5 seconds
- Stable 5-minute conversation on a physical Android device
- No unrecovered audio deadlock

If these are not achievable, document measured latency and choose the fallback path deliberately.

## NFR-003 — UI

- Keep animation smooth on representative hardware.
- Avoid blocking JS thread during transcript updates.
- Virtualise long transcript lists.
- Avoid re-rendering the full session screen on every audio event.

## NFR-004 — Offline behaviour

Offline:

- User can open existing local history.
- User can read previous feedback.
- New AI practice clearly explains that connection is required.
- Billing state uses a safe cached state and refreshes when online.
- Do not unlock server-cost features based solely on stale client state indefinitely.

## NFR-005 — Error handling

Every user-visible error must include:

- What failed
- Whether work was saved
- The next action
- Retry where safe

## NFR-006 — Observability

Track:

- API error rate
- AI session creation failure
- AI disconnect
- Evaluation invalid-schema rate
- Purchase failure/cancellation
- Notification scheduling failure
- Crash-free users
- Latency
- AI cost per completed practice

---

# 21. Security

## SEC-001 — Secrets

Mobile-safe public values only:

- Backend base URL
- RevenueCat public Google Play SDK key
- OneSignal App ID
- Analytics public project key where applicable

Server-only:

- AI provider secret
- RevenueCat private API key
- RevenueCat webhook secret/auth token
- OneSignal REST API key
- Database URL
- JWT signing key
- Sentry server auth token
- Google service-account credentials

## SEC-002 — Authentication

- Signed short-lived backend tokens
- Stable anonymous subject
- Token rotation
- Server-side authorisation for billable operations
- Rate limits by user and network signals
- No client-controlled Pro flag

## SEC-003 — Input handling

- Validate all API input
- Enforce length limits
- Reject unsupported media types
- Protect audio upload endpoints
- Limit request body size
- Sanitize logs
- Use parameterised database access

## SEC-004 — Dependency hygiene

- Lockfile committed
- Automated dependency audit
- Review native SDK permissions
- Remove unused permissions
- Generate licence inventory before release

---

# 22. Testing Strategy

## 22.1 Unit tests

Required:

- Scenario validation
- Session state machine
- Entitlement mapping
- Usage calculation
- Confidence calculation
- Evaluation evidence validator
- Analytics redaction
- Reminder scheduling
- Deep-link parsing
- Purchase error mapping

## 22.2 API integration tests

Required:

- Anonymous auth
- Practice authorisation
- Free quota
- Pro entitlement path
- Rate limit
- Evaluation schema validation
- Invalid evidence rejection
- RevenueCat webhook idempotency
- Reminder creation
- Data deletion

## 22.3 Contract tests

Use shared schemas to ensure mobile/API compatibility.

## 22.4 E2E tests

Use Maestro or an equivalent Android-capable tool for:

1. First launch → onboarding → text practice → feedback
2. Voice practice happy path using a controllable test provider
3. Paywall opens
4. Purchase cancellation
5. Pro entitlement unlock
6. Restore
7. Schedule reminder
8. Notification deep link
9. Delete practice
10. Delete all data

## 22.5 Physical-device manual test matrix

Test at least:

- Modern Pixel/Android reference device
- Samsung Galaxy device if available
- Mid-range Android device
- Wi-Fi
- Mobile data
- Network switch during practice
- Bluetooth headset
- Speaker
- Wired/USB audio if available
- Incoming call/interruption
- App background/foreground
- Screen lock
- Microphone denied
- Notification denied
- Google Play licence tester purchase
- Subscription expiry/restore where feasible

## 22.6 RevenueCat release tests

Before production:

- Test Store/preview flow
- Google Play internal-testing purchase
- Entitlement activation
- App restart
- Restore
- Cancellation
- Expiry simulation
- Offering unavailable
- Network failure
- Production build uses platform-specific production SDK key
- No Test Store key in production

## 22.7 OneSignal tests

- Permission prompt after value/context
- Correct external ID
- Campaign delivery
- Deep link
- Timezone
- Opt-out
- No confidential lock-screen content
- No duplicate notification

---

# 23. Release and Store Requirements

## REL-000 — Play production-access gate

Before relying on any public-release date:

- Confirm the intended Play Console account type, creation date, verification status, and current production access.
- Record the result in `docs/shipaton-compliance.md`.
- If the account is a personal developer account created after 2023-11-13 and the current Google Play testing requirement applies, start the required closed test immediately with at least 12 continuously opted-in testers for at least 14 days.
- Collect real tester engagement and feedback suitable for the production-access application.
- Allow time for Google to review the production-access request; do not assume eligibility is automatic on day 14.

Reference: [Google Play testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)

## REL-001 — Build profiles

Provide:

- Development build
- Internal preview build
- Production AAB

Do not rely on Expo Go for native integration testing.

## REL-002 — Android configuration

- Unique package ID supplied by owner
- Production signing
- Current Google Play target SDK requirement
- Minimum SDK compatible with all required native SDKs
- Microphone permission with clear rationale
- Notification permission handling
- No unnecessary permissions
- Deep links configured
- Correct app links where used

## REL-003 — Google Play listing

Prepare:

- Final app name after availability/trademark check
- Short description
- Full description
- App icon
- Feature graphic
- Screenshots
- Privacy policy URL
- Support URL/email
- Data Safety form
- Content rating
- Target audience
- Subscription disclosure
- AI feature disclosure where required
- US availability
- Test instructions for review if requested

## REL-004 — Privacy policy

The policy must accurately describe:

- Microphone use
- AI provider processing
- Transcript processing
- Local storage
- Server metadata
- RevenueCat
- Google Play Billing
- OneSignal
- Analytics
- Crash reporting
- Retention
- Deletion
- Contact details

Do not claim that data never leaves the device if transcript/audio is sent to an AI service.

## REL-005 — Early release target

Target Phase 1 public release:

- **2026-09-07 to 2026-09-10** when the developer account already has production access.
- **Immediately after approval, with an internal latest target of 2026-09-20**, when mandatory closed testing and production-access review apply.

The closed-test build should be usable by **2026-08-27** if the testing gate applies.

This leaves time for:

- Real users
- Revenue
- Feedback
- Retention evidence
- Paywall iteration
- Scenario improvement
- Submission preparation

---

# 24. Two-Phase Delivery Plan

## Phase 1 — Publishable Core

**Target window:** 2026-08-20 through the first approved public release, ideally 2026-09-07 to 2026-09-10 and no later than the internal 2026-09-20 contingency target.

### Checkpoint 1 — Realtime technical spike

**Timebox:** 48 hours.

Deliver:

- Repository assessment and implementation plan
- Physical Android development build
- One scenario and one persona behind the defined provider/domain contracts
- Voice round trip
- Live transcript
- Clean and idempotent session termination
- Measured median/P95 latency
- Five-minute stability test
- Basic evidence-grounded structured evaluation
- Cost estimate per practice
- ADR selecting WebRTC or the turn-based fallback

Exit criteria:

- Repeatable physical-device demonstration
- No standard AI secret in the mobile bundle
- Median/P95 latency measured
- Transcript captured
- Evaluation schema and quote-grounding validation pass
- Known blockers and external credentials documented
- Explicit go/no-go decision for the realtime path

### Checkpoint 2 — Core closed-test product

Deliver:

- Monorepo, navigation, design tokens, anonymous identity, local data, API, analytics adapter, error boundaries, and CI
- Three Phase 1 scenarios and two Phase 1 personas
- Voice practice and text fallback
- Session state machine, duration/cost limits, interruption handling, and partial recovery
- Live transcript and evidence-grounded evaluation
- Preparedness before/after
- Highlighted-moment retry and concise comparison
- Minimal history and deletion
- Schedule-real-conversation local reminder and deep link
- Privacy, safety, and failure states
- Representative evaluation release set
- AAB distributed through internal/closed testing
- Active tester feedback collection where the Play production-access gate applies

Exit criteria:

- Core journey works repeatedly on a physical Android device
- No fabricated quote or ungrounded evidence in the release test set
- Billable AI sessions close after end, timeout, interruption, and backgrounding
- No release-blocking crash or privacy defect
- Testers can complete practice, feedback, retry, deletion, and reminder flows

### Checkpoint 3 — Monetised public release

Deliver:

- RevenueCat production SDK integration
- Monthly and annual packages and `pro` entitlement
- Contextual paywall, restore, manage subscription, and trial/judge access
- Server-side usage and entitlement enforcement
- Google Play licence-tester purchase, cancellation, restore, expiry/revocation, network-failure, and offering-unavailable tests
- Crash reporting, operational monitoring, support path, privacy/terms, Data Safety, store listing, and production AAB
- Live Google Play listing available to US users
- First acquisition and build-in-public activity

Phase 1 exit criteria:

- Every Phase 1 capability in Section 5.2 is complete
- Phase 1 Definition of Done in Section 25 passes
- A real Google Play purchase activates the RevenueCat entitlement
- Published behaviour matches product and store claims
- Production monitoring is active
- Real users can install, practise, purchase, restore, and delete their data

## Phase 2 — Competition Expansion and Submission

**Target window:** immediately after the Phase 1 release candidate is stable through 2026-09-27. Work that does not destabilise the frozen Phase 1 candidate may proceed during store review.

### Checkpoint 1 — Complete product and retention

Deliver:

- Remaining three scenarios and anxious persona
- Calibration across the complete six-by-three matrix
- Pause-and-coach
- Complete-scenario retry and richer attempt comparison
- History search and communication-pattern summary
- Scenario bookmarking
- OneSignal SDK, identity, permission flow, real campaign/Journey, privacy-safe notification, and deep link
- Migration from local-only reminder delivery without duplicates
- Full 50-transcript golden evaluation set

### Checkpoint 2 — Growth and award evidence

Deliver:

- Feedback-led scenario, onboarding, paywall, and retention improvements
- At least one responsible onboarding/paywall experiment when traffic permits
- Shareable non-confidential progress card
- Design-showcase motion and accessibility polish
- Full physical-device, RevenueCat, OneSignal, privacy, security, performance, and regression matrices
- Real metrics for installs, activation, completion, retry, retention, conversion, revenue, and AI cost
- Build-in-public evidence showing what changed because of users
- Optional urgent pack only if all required work is already stable

### Checkpoint 3 — Competition submission

Deliver:

- Final production update on Google Play
- Verified judge trial or promo access
- Final store listing and privacy/Data Safety accuracy
- Public demo video under two minutes using production behaviour
- 1024 × 1024 icon
- Required 1179 × 2556 screenshot without device frame
- Final English Devpost description
- Career Coaching, HAMM, Design, Build in Public, OneSignal, and growth evidence
- Google Play and public video URLs
- Final submission by 2026-09-27

Phase 2 exit criteria:

- Every required Phase 2 capability in Section 5.3 is complete
- Every non-optional requirement in this document is satisfied
- Final Definition of Done in Section 25 passes
- Submission claims and media match the published production application

---

# 25. Definition of Done

## 25.1 Phase 1 release gate

Phase 1 is done only when all of the following are true:

### Core product

- [ ] New user can begin a practice within 60 seconds.
- [ ] The three Phase 1 scenarios and two Phase 1 personas work in production.
- [ ] Feedback, boundaries, and saying-no use cases are represented.
- [ ] Voice practice is stable on a physical Android device.
- [ ] Text fallback works.
- [ ] Pre/post preparedness rating works.
- [ ] Feedback is linked to exact transcript evidence and invalid quotes are rejected.
- [ ] Highlighted-moment retry and concise comparison work.
- [ ] Minimal history, deletion, local reminder, and reminder deep link work.

### AI, privacy, and quality

- [ ] Standard AI API secret is server-side only.
- [ ] Billable sessions end on normal completion, timeout, interruption, and backgrounding.
- [ ] Roleplay and evaluation prompts are separate.
- [ ] Evaluation output is schema-validated and the representative release set passes agreed thresholds.
- [ ] Safety-sensitive inputs produce appropriate cautions.
- [ ] Raw audio is not retained by default.
- [ ] Transcript is not persisted server-side by default.
- [ ] Data deletion works locally and server-side.
- [ ] TypeScript, lint, core unit/API/contract/E2E, and release checks pass.
- [ ] No known release-blocking crash, security defect, or confidential data in analytics/logs.

### Billing and release

- [ ] Official RevenueCat React Native SDK powers a real Google Play purchase.
- [ ] Monthly and annual packages, `pro` entitlement, cancellation, restore, expiry/revocation, and manage-subscription path work.
- [ ] Server-side usage does not trust a client-supplied Pro flag.
- [ ] Trial or judge access works.
- [ ] No Test Store key is present in production.
- [ ] Play production-access status and any required closed test are documented.
- [ ] App is publicly available on Google Play in the United States inside the competition window.
- [ ] Store claims, privacy policy, Data Safety declaration, and published behaviour agree.
- [ ] Production monitoring and support path are active.

## 25.2 Phase 2 final gate

Phase 2 is done only when the following complete-product and competition requirements are true. These preserve the original final Definition of Done.

### Product

- [ ] New user can begin a practice within 60 seconds.
- [ ] Six scenarios are available.
- [ ] Feedback, boundaries, and saying-no use cases are represented.
- [ ] Three realistic employee response styles work.
- [ ] Voice practice works on a physical Android device.
- [ ] Text fallback works.
- [ ] Pre/post confidence rating works.
- [ ] Feedback is linked to exact transcript evidence.
- [ ] Retry works.
- [ ] History and deletion work.
- [ ] Reminder deep link works.

### AI

- [ ] Standard AI API secret is server-side only.
- [ ] Roleplay and evaluation prompts are separate.
- [ ] Roleplay does not coach unless explicitly paused.
- [ ] Evaluation output is schema-validated.
- [ ] Quotes are grounded in real user turns.
- [ ] Golden evaluation tests pass agreed thresholds.
- [ ] Safety-sensitive scenarios produce appropriate cautions.
- [ ] Raw audio is not retained by default.
- [ ] Transcript is not persisted server-side by default.

### RevenueCat

- [ ] Official RevenueCat React Native SDK is installed.
- [ ] Production build uses the Google Play RevenueCat public SDK key.
- [ ] At least one real Google Play purchase is powered by RevenueCat.
- [ ] Offerings load dynamically.
- [ ] Monthly and annual packages work.
- [ ] `pro` entitlement unlocks features.
- [ ] Purchase cancellation does not show an error.
- [ ] Restore purchases works.
- [ ] Expiry/revocation updates access.
- [ ] Server does not trust client Pro flag.
- [ ] Trial or judge promo access works.
- [ ] No Test Store key is present in production.

### OneSignal

- [ ] Official SDK is integrated.
- [ ] External ID is set.
- [ ] Permission request is contextual.
- [ ] At least one real campaign is deployed.
- [ ] Notification is privacy-safe.
- [ ] Deep link opens final rehearsal.
- [ ] OneSignal App ID and evidence are recorded.

### Quality

- [ ] TypeScript strict mode passes.
- [ ] Lint passes.
- [ ] Unit tests pass.
- [ ] API integration tests pass.
- [ ] E2E critical path passes.
- [ ] No known release-blocking crash.
- [ ] Backgrounding ends or safely pauses billable session.
- [ ] Accessibility pass completed.
- [ ] No confidential data in analytics/logs.
- [ ] Error states provide recovery action.

### Shipaton

- [ ] First public release is inside the official submission period.
- [ ] App is fully published on Google Play.
- [ ] App is available in the United States.
- [ ] App works as shown in submission.
- [ ] RevenueCat SDK powers a real purchase.
- [ ] English description is complete.
- [ ] Demo video is public and under two minutes.
- [ ] Demo shows functioning Android app.
- [ ] Icon is 1024 × 1024.
- [ ] Required screenshot is 1179 × 2556 without device frame.
- [ ] Trial or promo code unlocks premium for judges.
- [ ] Influencer identity/brand restriction is respected.
- [ ] Career Coaching category description is complete.
- [ ] HAMM strategy/results are documented.
- [ ] Design highlights are documented.
- [ ] Build-in-public links and product changes are documented.
- [ ] OneSignal campaign evidence is documented.
- [ ] Grand Prize growth and revenue evidence is documented.
- [ ] Submission is final before the internal 2026-09-27 deadline.

---

# 26. Two-Minute Demo Requirement

Target script:

## 0–12 seconds — Problem

> “Tomorrow I need to tell a team member their performance is not acceptable. I know the message. I do not know how to say it.”

## 12–25 seconds — Setup

- Open Say It First
- Select “Underperformance feedback”
- Select “Defensive”
- Rate confidence: 2/5
- Start practice

## 25–65 seconds — Real practice

Show a concise real voice exchange.

The AI employee pushes back:

> “I do not think that is fair. The requirements changed twice.”

The manager responds too vaguely or over-explains.

## 65–90 seconds — Evidence-backed feedback

Show:

- Clarity score
- Boundary score
- Missing next step
- Exact transcript excerpt
- Suggested stronger sentence

## 90–106 seconds — Retry

Retry the difficult moment with a stronger response.

Show score or feedback improvement and confidence change.

## 106–116 seconds — Retention

Schedule the real conversation and show the OneSignal reminder/deep link.

## 116–120 seconds — Monetisation

Briefly show the RevenueCat-powered Pro offering and end on:

> Practise it here. Say it better for real.

The final video must use real production behaviour and must not depend on fake screens.

---

# 27. Build-in-Public Operating Log

For each meaningful public update, add an entry to `docs/build-in-public-log.md`:

```md
## YYYY-MM-DD — Short title

### Hypothesis
What we believed.

### What we built or tested
Concrete work.

### Evidence
Metric, screenshot, user quote with permission, or test result.

### Feedback
What people said.

### Decision
What changed because of the evidence.

### Public links
- Link 1
- Link 2
```

Recommended public topics:

- Why active rehearsal beats passive management scripts
- First realtime latency result
- AI employee was too agreeable and how it was fixed
- Evaluation invented a quote and how grounding validation was added
- Managers ranked the six scenarios
- Before/after feedback screen
- Paywall timing experiment
- Notification copy test
- First completed practice
- First paying user
- What caused repeat use
- What was removed to ship sooner

Never publish user transcripts or confidential workplace context.

---

# 28. Required Human Inputs

Codex should proceed with placeholders until these values are supplied:

- Final app name
- Android package ID
- Google Play developer account type, creation date, verification status, and production-access status
- Google Play Console access/configuration
- Google Play product IDs and base plans
- RevenueCat project/app
- RevenueCat public Google Play SDK key
- RevenueCat private server API key
- RevenueCat webhook auth secret
- OneSignal App ID
- OneSignal REST API key
- AI provider API key
- Database URL
- Production API domain
- Privacy-policy domain and contact details
- Analytics provider/project
- Sentry project
- Brand assets
- Support email
- Subscription prices and trial decision
- Final store availability countries
- Judge access method

Add all required keys to `.env.example` with comments and no secret values.

Example categories:

```dotenv
# Mobile-public
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_ANALYTICS_KEY=

# Server-private
DATABASE_URL=
JWT_SIGNING_KEY=
OPENAI_API_KEY=
AI_REALTIME_MODEL=
AI_EVALUATION_MODEL=
REVENUECAT_SECRET_API_KEY=
REVENUECAT_WEBHOOK_AUTH=
ONESIGNAL_REST_API_KEY=
SENTRY_AUTH_TOKEN=
```

---

# 29. Source-of-Truth References

Recheck these before final submission because competition rules and SDK documentation may change:

- [Shipaton 2026 official rules](https://revenuecat-shipaton-2026.devpost.com/rules)
- [Shipaton 2026 main page and category descriptions](https://revenuecat-shipaton-2026.devpost.com/)
- [RevenueCat Shipaton 2026 announcement](https://www.revenuecat.com/blog/company/announcing-shipaton-2026)
- [RevenueCat Expo installation](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [RevenueCat React Native installation](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [RevenueCat sandbox and launch testing](https://www.revenuecat.com/docs/test-and-launch/sandbox)
- [OneSignal Expo SDK setup](https://documentation.onesignal.com/docs/en/react-native-expo-sdk-setup)
- [Expo documentation](https://docs.expo.dev/)
- [OpenAI Realtime WebRTC guide](https://developers.openai.com/api/docs/guides/realtime-webrtc)
- [Google Play testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)

---

# 30. First Codex Task

Start with **Phase 1, Checkpoint 1 — realtime technical spike** only.

Produce:

1. Repository assessment
2. `PLAN.md`
3. Minimal Expo Android development build
4. Minimal Fastify API
5. One hard-coded scenario behind a proper `ScenarioDefinition`
6. One employee persona
7. A provider abstraction
8. A physical-device realtime voice proof
9. Live transcript
10. Structured evaluation with quote-grounding validation
11. Latency and cost report
12. ADR choosing preferred realtime or fallback architecture
13. Risks and blocked external credentials

Do not implement the complete screen set or monetisation before the Phase 1 technical voice/evaluation proof is demonstrated and measured.
