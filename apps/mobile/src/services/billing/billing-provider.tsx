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

type BillingContextValue = BillingSnapshot & {
  refresh: () => Promise<void>;
  purchase: (packageIdentifier: string) => Promise<BillingActionResult>;
  restore: () => Promise<BillingActionResult>;
  manage: () => Promise<BillingActionResult>;
  recordPaywallViewed: (source: string) => void;
  recordPlanSelected: (plan: BillingPlan) => void;
};

const BillingContext = createContext<BillingContextValue | null>(null);

export function BillingProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState(initialBillingSnapshot);

  useEffect(() => {
    const unsubscribe = revenueCatBilling.subscribe(setSnapshot);
    void getOrCreateAnonymousUserId().then((appUserID) => revenueCatBilling.configure(appUserID));
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

  const value = useMemo<BillingContextValue>(
    () => ({
      ...snapshot,
      refresh,
      purchase,
      restore,
      manage,
      recordPaywallViewed,
      recordPlanSelected,
    }),
    [
      manage,
      purchase,
      recordPaywallViewed,
      recordPlanSelected,
      refresh,
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
