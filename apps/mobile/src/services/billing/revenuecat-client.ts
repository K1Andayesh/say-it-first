import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

import { diagnosticLog } from "@/services/diagnostics/diagnostic-log";
import {
  billingPeriodFromPackage,
  DEFAULT_OFFERING_ID,
  hasProEntitlement,
  initialBillingSnapshot,
  type BillingActionResult,
  type BillingPlan,
  type BillingSnapshot,
} from "./billing-model";

type Offerings = Awaited<ReturnType<typeof Purchases.getOfferings>>;
type RevenueCatPackage = NonNullable<Offerings["current"]>["availablePackages"][number];
type SnapshotListener = (snapshot: BillingSnapshot) => void;

function configuredPublicKey(): string | null {
  const configured: unknown = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;
  if (typeof configured !== "string") return null;
  const key = configured.trim();
  return key ? key : null;
}

function publicErrorCode(error: unknown): string {
  if (!error || typeof error !== "object") return "unknown";
  const code: unknown = Reflect.get(error, "code");
  return typeof code === "string" || typeof code === "number" ? String(code) : "unknown";
}

function isUserCancellation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const userCancelled: unknown = Reflect.get(error, "userCancelled");
  if (userCancelled === true) return true;
  return (
    publicErrorCode(error) === String(Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR)
  );
}

function toBillingPlan(rcPackage: RevenueCatPackage): BillingPlan {
  const product = rcPackage.product;
  return {
    packageIdentifier: rcPackage.identifier,
    productIdentifier: product.identifier,
    title: product.title,
    description: product.description,
    priceString: product.priceString,
    price: product.price,
    currencyCode: product.currencyCode,
    period: billingPeriodFromPackage(String(rcPackage.packageType), product.identifier),
  };
}

class RevenueCatBillingClient {
  private snapshot: BillingSnapshot = initialBillingSnapshot;
  private listeners = new Set<SnapshotListener>();
  private packages = new Map<string, RevenueCatPackage>();
  private configured = false;
  private configuring: Promise<void> | null = null;

  public current(): BillingSnapshot {
    return this.snapshot;
  }

  public subscribe(listener: SnapshotListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  public async configure(appUserID: string): Promise<void> {
    if (this.configured) return;
    if (this.configuring) return this.configuring;
    this.configuring = this.configureOnce(appUserID);
    try {
      await this.configuring;
    } catch (error) {
      this.configured = false;
      diagnosticLog.record("warn", "billing.configuration.failed", {
        errorCode: publicErrorCode(error),
      });
      this.publish({
        ...initialBillingSnapshot,
        status: "unavailable",
        message: "Google Play billing could not start. Reopen the app and try again.",
      });
    } finally {
      this.configuring = null;
    }
  }

  private async configureOnce(appUserID: string): Promise<void> {
    const apiKey = configuredPublicKey();
    if (Platform.OS !== "android") {
      this.publish({
        ...initialBillingSnapshot,
        status: "unavailable",
        message: "Purchases are currently available on Android.",
      });
      return;
    }
    if (!apiKey) {
      diagnosticLog.record("warn", "billing.configuration.unavailable", {
        reason: "public_key_missing",
      });
      this.publish({
        ...initialBillingSnapshot,
        status: "unavailable",
        message: "Google Play plans are not connected in this build yet.",
      });
      return;
    }
    if (!__DEV__ && apiKey.toLowerCase().startsWith("test_")) {
      diagnosticLog.record("error", "billing.configuration.rejected", {
        reason: "test_store_key_in_release",
      });
      this.publish({
        ...initialBillingSnapshot,
        status: "unavailable",
        message: "Billing is unavailable in this release.",
      });
      return;
    }

    diagnosticLog.record("info", "billing.configuration.started", { platform: Platform.OS });
    await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
    if (!(await Purchases.isConfigured())) Purchases.configure({ apiKey, appUserID });
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      this.publish({ ...this.snapshot, isPro: hasProEntitlement(customerInfo) });
      diagnosticLog.record("info", "billing.customer_info.updated", {
        isPro: hasProEntitlement(customerInfo),
      });
    });
    this.configured = true;
    await this.refresh();
    diagnosticLog.record("info", "billing.configuration.completed", {
      planCount: this.snapshot.plans.length,
      isPro: this.snapshot.isPro,
    });
  }

  public async refresh(): Promise<void> {
    if (!this.configured) return;
    try {
      const [offerings, customerInfo] = await Promise.all([
        Purchases.getOfferings(),
        Purchases.getCustomerInfo(),
      ]);
      const offering = offerings.all[DEFAULT_OFFERING_ID] ?? offerings.current;
      this.packages.clear();
      for (const rcPackage of offering?.availablePackages ?? []) {
        this.packages.set(rcPackage.identifier, rcPackage);
      }
      const plans = [...this.packages.values()]
        .map(toBillingPlan)
        .sort((left, right) => {
          const order = { annual: 0, monthly: 1, other: 2 } as const;
          return order[left.period] - order[right.period];
        });
      this.publish({
        status: "ready",
        isPro: hasProEntitlement(customerInfo),
        offeringIdentifier: offering?.identifier ?? null,
        plans,
        message:
          plans.length > 0
            ? null
            : "No Google Play plans are available right now. Please try again shortly.",
      });
      diagnosticLog.record("info", "billing.offerings.loaded", {
        offeringAvailable: Boolean(offering),
        planCount: plans.length,
      });
    } catch (error) {
      diagnosticLog.record("warn", "billing.refresh.failed", { errorCode: publicErrorCode(error) });
      this.publish({
        ...this.snapshot,
        status: "unavailable",
        message: "Plans could not be loaded. Check your connection and try again.",
      });
    }
  }

  public async purchase(packageIdentifier: string): Promise<BillingActionResult> {
    if (!this.configured) {
      return { status: "failed", message: "Google Play billing is not connected in this build." };
    }
    await this.refresh();
    const rcPackage = this.packages.get(packageIdentifier);
    if (!rcPackage) {
      return { status: "failed", message: "That plan is temporarily unavailable. Refresh and retry." };
    }

    diagnosticLog.record("info", "billing.purchase.initiated", {
      offeringIdentifier: this.snapshot.offeringIdentifier,
      packageIdentifier,
      productIdentifier: rcPackage.product.identifier,
    });
    try {
      const result = await Purchases.purchasePackage(rcPackage);
      const isPro = hasProEntitlement(result.customerInfo);
      this.publish({ ...this.snapshot, isPro });
      if (!isPro) {
        diagnosticLog.record("warn", "billing.purchase.entitlement_missing", { packageIdentifier });
        return {
          status: "failed",
          message: "Google Play completed the purchase, but Pro is still syncing. Restore purchases shortly.",
        };
      }
      diagnosticLog.record("info", "billing.purchase.completed", { packageIdentifier, isPro });
      return { status: "purchased", message: "Pro is active. Your practice room is unlocked." };
    } catch (error) {
      if (isUserCancellation(error)) {
        diagnosticLog.record("info", "billing.purchase.cancelled", { packageIdentifier });
        return { status: "cancelled", message: "No purchase was made." };
      }
      diagnosticLog.record("warn", "billing.purchase.failed", {
        packageIdentifier,
        errorCode: publicErrorCode(error),
      });
      return { status: "failed", message: "The purchase did not complete. Nothing was charged." };
    }
  }

  public async restore(): Promise<BillingActionResult> {
    if (!this.configured) {
      return { status: "failed", message: "Google Play billing is not connected in this build." };
    }
    diagnosticLog.record("info", "billing.restore.initiated");
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPro = hasProEntitlement(customerInfo);
      this.publish({ ...this.snapshot, isPro });
      diagnosticLog.record("info", "billing.restore.completed", { isPro });
      return isPro
        ? { status: "restored", message: "Your Pro access has been restored." }
        : { status: "nothing_to_restore", message: "No active Pro purchase was found for this account." };
    } catch (error) {
      diagnosticLog.record("warn", "billing.restore.failed", { errorCode: publicErrorCode(error) });
      return { status: "failed", message: "Purchases could not be restored. Check your connection and retry." };
    }
  }

  public async presentCustomerCenter(): Promise<BillingActionResult> {
    if (!this.configured) {
      return { status: "failed", message: "Subscription management is not connected in this build." };
    }
    diagnosticLog.record("info", "billing.customer_center.opened");
    try {
      await RevenueCatUI.presentCustomerCenter();
      await this.refresh();
      return { status: "restored", message: "Subscription status refreshed." };
    } catch (error) {
      diagnosticLog.record("warn", "billing.customer_center.failed", {
        errorCode: publicErrorCode(error),
      });
      return { status: "failed", message: "Subscription management could not be opened." };
    }
  }

  public recordPaywallViewed(source: string): void {
    diagnosticLog.record("info", "billing.paywall.viewed", {
      source,
      offeringIdentifier: this.snapshot.offeringIdentifier,
      planCount: this.snapshot.plans.length,
    });
  }

  public recordPlanSelected(plan: BillingPlan): void {
    diagnosticLog.record("info", "billing.paywall.plan_selected", {
      offeringIdentifier: this.snapshot.offeringIdentifier,
      packageIdentifier: plan.packageIdentifier,
      productIdentifier: plan.productIdentifier,
      period: plan.period,
    });
  }

  private publish(snapshot: BillingSnapshot): void {
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener(snapshot);
  }
}

export const revenueCatBilling = new RevenueCatBillingClient();
