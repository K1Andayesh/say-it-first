# RevenueCat Billing Runbook

Status: SDK, custom paywall, Test Store lifecycle, and the official Google Play billing path are
verified on Android. On 29 August 2026 a Play-distributed license-test Annual subscription activated
`Pro` on a Samsung Galaxy S10. It incurred no charge and must not be reported as real revenue.

## Locked identifiers

These values are production contracts. Treat them as case-sensitive and do not create near-duplicate
identifiers.

| Purpose | Value |
|---|---|
| RevenueCat project | `Say It First` |
| Production RevenueCat app | `Say It First (Play Store)` |
| Production Android package | `app.sayitfirst` |
| Development Android package | `app.sayitfirst.dev` |
| Entitlement identifier | `Pro` |
| Current offering identifier | `default` |
| Test Store monthly product | `monthly` |
| Test Store annual product | `yearly` |
| Planned Play monthly product | `sayitfirst_pro_monthly` |
| Planned Play annual product | `sayitfirst_pro_annual` |

The entitlement was created by RevenueCat onboarding with the immutable identifier `Pro`. The app
must use that exact casing. The Play products are attached to the live `default` offering; retain
the locked identifiers above for future configuration and audits.

## Implemented runtime path

1. The mobile app creates and persists a random anonymous app user ID.
2. RevenueCat is configured once with the public Android SDK key.
3. The app fetches the `default` offering and renders store-provided packages and prices.
4. Annual savings are calculated only when monthly and annual packages use the same currency.
5. Purchase success is accepted only when CustomerInfo contains an active `Pro` entitlement.
6. Restore is available only from an explicit user action.
7. Active subscribers can open RevenueCat Customer Center from the paywall.
8. Diagnostics record lifecycle, package identifiers, status, and safe error codes. They exclude
   payment details, credentials, audio, and transcript text.

## Verified Test Store evidence

- Native Android debug build compiled with `react-native-purchases` and
  `react-native-purchases-ui`.
- Android manifest contains the billing permission.
- The custom paywall loaded the live `default` offering with Monthly and Annual packages.
- The displayed 33% annual saving was calculated from the live Test Store prices.
- A simulated valid Annual purchase activated `Pro` in the app.
- The app rendered `PRO IS ACTIVE` and `Pro is active. Your practice room is unlocked.`
- A user-triggered restore retained active Pro access.
- Customer Center opened and displayed the active Test Store subscription.
- RevenueCat recorded one sandbox Yearly `New Sub` transaction for the same anonymous customer.
- Terms and Privacy views opened and returned correctly in the actual Android UI.
- Sandbox entitlement access is restricted to the current test app user ID rather than Anybody.

This evidence proves the integration and product flow, not competition purchase eligibility. Test
Store transactions generate no real revenue and must never be presented as genuine purchases.

## Verified Google Play evidence

- The Samsung test account opted into the official closed test and installed `app.sayitfirst` from
  Google Play rather than through ADB.
- RevenueCat returned store-backed Monthly ($9.99/month) and Annual ($79.99/year) packages in the
  production app UI during the test.
- Restore completed through the production SDK path and correctly reported no active entitlement
  before purchase.
- Continue With Annual opened the native Google Play Billing sheet for Say It First Pro Annual.
- The sheet explicitly identified a license-test subscription and confirmed that no charge would
  occur; the configured test card approved it.
- Returning to the app displayed `Pro is active. Your practice room is unlocked.` and the header
  changed to `PRO ACTIVE`.
- The entitlement remained active after relaunch and after the device antivirus was re-enabled.

This is stronger than a Test Store simulation because the shipped package, Play Billing, the
RevenueCat production app, and the runtime entitlement contract all participated. It is still a
test subscription, not a paying customer or real revenue.

## Key handling

- EAS project: `@keyvan.andayesh/say-it-first`, linked from `apps/mobile/app.config.ts`.
- Test Store public key: ignored local environment plus sensitive EAS development and preview
  variables.
- Production Play public key: sensitive EAS production variable. It is not committed to Git.
- RevenueCat secret keys and webhook authentication: API/server environment only, never
  `EXPO_PUBLIC_*`, the mobile bundle, Git, screenshots, or logs.
- Production code rejects a `test_` key to prevent an invalid store submission.

## Remaining Google Play completion sequence

1. Complete the required closed-test tester count/duration and obtain production access.
2. Confirm the monthly and annual product metadata, localized benefits, prices, tax settings, and
   renewal terms in every launch territory.
3. Audit the Play service account for minimum required permissions. Never add its JSON credentials
   to this repository.
4. Confirm Google developer notifications deliver renewal, cancellation, billing
   issue, and expiry events promptly.
5. Create each production EAS build using the configured production public SDK key. Confirm the
   bundle contains neither a Test Store key nor a server secret.
6. Exercise cancellation, restore, renewal, expiry, offline launch, reinstall,
   and banking-app return. Verify both the app entitlement and RevenueCat/Play records.
7. Record the first non-test customer transaction separately from all license-test evidence.

## Release blockers

- Required Play closed-test tester count/duration and production-access approval.
- Remaining purchase lifecycle tests and developer-notification verification.
- First non-test customer transaction and truthful revenue evidence.
- Enforcement of the advertised free/Pro feature boundary across every scenario and retry path.
- Play listing links and copy confirmed against the deployed production Terms, Privacy, and support
  pages.
