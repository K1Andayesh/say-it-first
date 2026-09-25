import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { getOrCreateAnonymousUserId } from "@/services/identity/anonymous-id";
import {
  initialBillingSnapshot,
  type BillingActionResult,
  type BillingPlan,
  type BillingSnapshot,
} from "./billing-model";
import { revenueCatBilling } from "./revenuecat-client";
import {
  activateReviewerAccess as activatePlayReviewerAccess,
  hasReviewerAccess,
} from "./reviewer-access";

type BillingContextValue = BillingSnapshot & {
  refresh: () => Promise<void>;
  purchase: (packageIdentifier: string) => Promise<BillingActionResult>;
  restore: () => Promise<BillingActionResult>;
  manage: () => Promise<BillingActionResult>;
  recordPaywallViewed: (source: string) => void;
  recordPlanSelected: (plan: BillingPlan) => void;
  activateReviewerAccess: (code: string) => Promise<BillingActionResult>;
};

const BillingContext = createContext<BillingContextValue | null>(null);

export function BillingProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState(initialBillingSnapshot);
  const [reviewerAccess, setReviewerAccess] = useState(false);

  useEffect(() => {
    const unsubscribe = revenueCatBilling.subscribe(setSnapshot);
    void getOrCreateAnonymousUserId().then((appUserID) => revenueCatBilling.configure(appUserID));
    void hasReviewerAccess().then(setReviewerAccess);
    return unsubscribe;
  }, []);

  const refresh = useCallback(() => revenueCatBilling.refresh(), []);
  const purchase = useCallback(
    (packageIdentifier: string) => revenueCatBilling.purchase(packageIdentifier),
    [],
  );
  const restore = useCallback(() => revenueCatBilling.restore(), []);
  const manage = useCallback(() => revenueCatBilling.presentCustomerCenter(), []);
  const recordPaywallViewed = useCallback(
    (source: string) => revenueCatBilling.recordPaywallViewed(source),
    [],
  );
  const recordPlanSelected = useCallback(
    (plan: BillingPlan) => revenueCatBilling.recordPlanSelected(plan),
    [],
  );
  const activateReviewerAccess = useCallback(async (code: string): Promise<BillingActionResult> => {
    const activated = await activatePlayReviewerAccess(code);
    if (!activated) {
      return { status: "failed", message: "That Play review access code is not valid." };
    }
    setReviewerAccess(true);
    return { status: "restored", message: "Play review access is active on this device." };
  }, []);

  const value = useMemo<BillingContextValue>(
    () => ({
      ...snapshot,
      isPro: snapshot.isPro || reviewerAccess,
      refresh,
      purchase,
      restore,
      manage,
      recordPaywallViewed,
      recordPlanSelected,
      activateReviewerAccess,
    }),
    [
      manage,
      purchase,
      activateReviewerAccess,
      recordPaywallViewed,
      recordPlanSelected,
      refresh,
      reviewerAccess,
      restore,
      snapshot,
    ],
  );

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling(): BillingContextValue {
  const context = useContext(BillingContext);
  if (!context) throw new Error("useBilling must be used within BillingProvider.");
  return context;
}
