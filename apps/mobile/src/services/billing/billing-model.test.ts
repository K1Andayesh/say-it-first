import { describe, expect, it } from "vitest";

import {
  annualSavingsPercent,
  billingPeriodFromPackage,
  hasProEntitlement,
} from "./billing-model";

describe("billing model", () => {
  it("derives Pro only from the active entitlement", () => {
    expect(hasProEntitlement({ entitlements: { active: { Pro: { isActive: true } } } })).toBe(true);
    expect(hasProEntitlement({ entitlements: { active: { pro: { isActive: true } } } })).toBe(false);
    expect(hasProEntitlement({ entitlements: { active: { other: {} } } })).toBe(false);
    expect(hasProEntitlement({})).toBe(false);
  });

  it("classifies standard and custom package identifiers", () => {
    expect(billingPeriodFromPackage("MONTHLY", "sayitfirst_pro_monthly")).toBe("monthly");
    expect(billingPeriodFromPackage("ANNUAL", "sayitfirst_pro_annual")).toBe("annual");
    expect(billingPeriodFromPackage("CUSTOM", "practice_pack_5")).toBe("other");
  });

  it("only claims an annual saving when the live prices prove it", () => {
    expect(
      annualSavingsPercent(
        { price: 12, currencyCode: "AUD" },
        { price: 96, currencyCode: "AUD" },
      ),
    ).toBe(33);
    expect(
      annualSavingsPercent(
        { price: 12, currencyCode: "AUD" },
        { price: 96, currencyCode: "USD" },
      ),
    ).toBeNull();
    expect(
      annualSavingsPercent(
        { price: 8, currencyCode: "AUD" },
        { price: 100, currencyCode: "AUD" },
      ),
    ).toBeNull();
  });
});
