// RevenueCat entitlement identifiers are case-sensitive. Keep this aligned with
// the immutable identifier created in the RevenueCat project.
export const PRO_ENTITLEMENT_ID = "Pro";
export const DEFAULT_OFFERING_ID = "default";

export type BillingPlanPeriod = "monthly" | "annual" | "other";

export type BillingPlan = {
  packageIdentifier: string;
  productIdentifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
  period: BillingPlanPeriod;
};

export type BillingSnapshot = {
  status: "initializing" | "ready" | "unavailable";
  isPro: boolean;
  offeringIdentifier: string | null;
  plans: readonly BillingPlan[];
  message: string | null;
};

export type BillingActionResult =
  | { status: "purchased"; message: string }
  | { status: "cancelled"; message: string }
  | { status: "restored"; message: string }
  | { status: "nothing_to_restore"; message: string }
  | { status: "failed"; message: string };

export type EntitlementContainer = {
  entitlements?: {
    active?: Readonly<Record<string, unknown>>;
  };
};

export function hasProEntitlement(customerInfo: EntitlementContainer): boolean {
  return customerInfo.entitlements?.active?.[PRO_ENTITLEMENT_ID] !== undefined;
}

export function billingPeriodFromPackage(
  packageType: string,
  productIdentifier: string,
): BillingPlanPeriod {
  const normalized = `${packageType} ${productIdentifier}`.toLowerCase();
  if (normalized.includes("annual") || normalized.includes("year")) return "annual";
  if (normalized.includes("month")) return "monthly";
  return "other";
}

export function annualSavingsPercent(
  monthly: Pick<BillingPlan, "price" | "currencyCode"> | null,
  annual: Pick<BillingPlan, "price" | "currencyCode"> | null,
): number | null {
  if (!monthly || !annual || monthly.currencyCode !== annual.currencyCode) return null;
  const annualizedMonthlyPrice = monthly.price * 12;
  if (annualizedMonthlyPrice <= 0 || annual.price >= annualizedMonthlyPrice) return null;
  return Math.round(((annualizedMonthlyPrice - annual.price) / annualizedMonthlyPrice) * 100);
}

export const initialBillingSnapshot: BillingSnapshot = {
  status: "initializing",
  isPro: false,
  offeringIdentifier: null,
  plans: [],
  message: null,
};
