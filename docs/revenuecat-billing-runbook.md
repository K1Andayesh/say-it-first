# RevenueCat Billing Runbook

Status: SDK, custom paywall, Test Store purchase, restore, and Customer Center verified on Android
on 21 August 2026. A genuine Google Play purchase is still required before Shipaton compliance can
be claimed.

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
must use that exact casing. The Play product identifiers remain planned until Play Console enables
app and product creation.

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

## Key handling

- EAS project: `@keyvan.andayesh/say-it-first`, linked from `apps/mobile/app.config.ts`.
- Test Store public key: ignored local environment plus sensitive EAS development and preview
  variables.
- Production Play public key: sensitive EAS production variable. It is not committed to Git.
- RevenueCat secret keys and webhook authentication: API/server environment only, never
  `EXPO_PUBLIC_*`, the mobile bundle, Git, screenshots, or logs.
- Production code rejects a `test_` key to prevent an invalid store submission.

## Google Play completion sequence

The Play Console personal developer account is currently waiting for Google identity verification;
Create app and contact-phone verification remain disabled until that review completes.

When Google enables the account:

1. Complete contact-phone verification.
2. Create the first Play app with package `app.sayitfirst` and the correct default language and app
   classification.
3. Create the monthly and annual subscription products with the locked identifiers above. Configure
   active base plans, accurate localized benefits, prices, tax settings, and renewal terms.
4. Create a Play service account with the minimum required permissions, then upload its JSON
   credentials directly to the RevenueCat Play app. Never add that file to this repository.
5. Configure Google developer notifications so RevenueCat receives renewal, cancellation, billing
   issue, and expiry events promptly.
6. Import or attach both Play products to the existing `Pro` entitlement and the matching Monthly
   and Annual packages in the `default` offering.
7. Create a production EAS build using the configured production public SDK key. Confirm the
   bundle contains neither a Test Store key nor a server secret.
8. Upload to Play internal or closed testing, add the test account as a license tester, and install
   the build from Google Play rather than by ADB.
9. Exercise purchase success, cancellation, restore, renewal, expiry, offline launch, reinstall,
   and banking-app return. Verify both the app entitlement and RevenueCat/Play records.
10. Only after a Play-distributed transaction activates `Pro` may the Shipaton RevenueCat gate be
    marked complete.

## Release blockers

- Google developer identity approval.
- Play app, subscription products, service credentials, and developer notifications.
- Production EAS build and Play-distributed purchase validation.
- Enforcement of the advertised free/Pro feature boundary across every scenario and retry path.
- Hosted production Terms, Privacy, and support contact matching the in-app text and Play listing.
