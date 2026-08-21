import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, radius, spacing, typography } from "@/design/tokens";
import {
  annualSavingsPercent,
  type BillingActionResult,
  type BillingPlan,
} from "@/services/billing/billing-model";
import { useBilling } from "@/services/billing/billing-provider";

type LegalDocument = "privacy" | "terms";

type ProPaywallProps = {
  visible: boolean;
  source: string;
  onClose: () => void;
};

const benefits = [
  "Practise beyond the two included sessions",
  "Unlock every scenario and employee response style",
  "Use advanced feedback, focused retries and progress history",
];

const legalCopy: Record<LegalDocument, readonly string[]> = {
  privacy: [
    "Say It First uses a random app identifier to keep your access and purchases consistent. We do not ask for your workplace identity in the current product.",
    "During a rehearsal, microphone audio and transcript events are processed by our AI provider to run the conversation and prepare feedback. Raw audio and transcript text are not retained by the Say It First API by default.",
    "Google Play processes payment details. RevenueCat receives purchase and entitlement records so the app can unlock Pro. Say It First does not receive your full payment-card details.",
    "Operational diagnostics may include timing, connection, purchase status and error codes. They exclude routine audio, transcript text, credentials and payment details.",
  ],
  terms: [
    "Say It First is a private rehearsal and coaching aid. It is not legal, medical, employment-relations or professional HR advice, and it does not make decisions about employees.",
    "The free plan includes two complete practices. Pro features and limits are described on the purchase screen and may evolve without removing an active paid entitlement during its billing period.",
    "Subscriptions are billed and renewed by Google Play under the price and renewal terms shown before confirmation. You can cancel or manage renewal through Google Play or the in-app subscription centre.",
    "Use the product lawfully and do not submit material you are not authorised to share. AI responses may be imperfect; review important wording before using it in a real conversation.",
  ],
};

function LegalView({ document, onBack }: { document: LegalDocument; onBack: () => void }) {
  const title = document === "privacy" ? "Privacy in plain language" : "Terms of use";
  return (
    <SafeAreaView style={styles.legalSafeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.legalHeader}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backGlyph}>←</Text>
        </Pressable>
        <Text style={styles.legalHeaderLabel}>SAY IT FIRST</Text>
      </View>
      <ScrollView contentContainerStyle={styles.legalContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>CLEAR BEFORE YOU CONTINUE</Text>
        <Text style={styles.legalTitle}>{title}</Text>
        <Text style={styles.legalUpdated}>Version 0.1 · 21 August 2026</Text>
        {legalCopy[document].map((paragraph) => (
          <Text key={paragraph} style={styles.legalParagraph}>
            {paragraph}
          </Text>
        ))}
        <Text style={styles.legalNote}>
          The production release will include the support contact and public hosted copy used in
          the Google Play listing.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({
  plan,
  selected,
  savings,
  onPress,
}: {
  plan: BillingPlan;
  selected: boolean;
  savings: number | null;
  onPress: () => void;
}) {
  const periodLabel =
    plan.period === "annual" ? "Annual" : plan.period === "monthly" ? "Monthly" : plan.title;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.planCard,
        selected && styles.planCardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.planCopy}>
        <View style={styles.planTitleRow}>
          <Text style={styles.planTitle}>{periodLabel}</Text>
          {plan.period === "annual" && savings ? (
            <View style={styles.savingsPill}>
              <Text style={styles.savingsText}>SAVE {savings}%</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.planDescription} numberOfLines={2}>
          {plan.description || (plan.period === "annual" ? "One year of Pro access" : "Flexible Pro access")}
        </Text>
      </View>
      <View style={styles.priceBlock}>
        <Text style={styles.planPrice}>{plan.priceString}</Text>
        <Text style={styles.planPeriod}>
          {plan.period === "annual" ? "per year" : plan.period === "monthly" ? "per month" : ""}
        </Text>
      </View>
    </Pressable>
  );
}

function resultIsPositive(result: BillingActionResult): boolean {
  return result.status === "purchased" || result.status === "restored";
}

export function ProPaywall({ visible, source, onClose }: ProPaywallProps) {
  const billing = useBilling();
  const [selectedPackageIdentifier, setSelectedPackageIdentifier] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"purchase" | "restore" | "manage" | null>(null);
  const [result, setResult] = useState<BillingActionResult | null>(null);
  const [legalDocument, setLegalDocument] = useState<LegalDocument | null>(null);

  const monthly = billing.plans.find((plan) => plan.period === "monthly") ?? null;
  const annual = billing.plans.find((plan) => plan.period === "annual") ?? null;
  const savings = annualSavingsPercent(monthly, annual);
  const selectedPlan = useMemo(
    () => billing.plans.find((plan) => plan.packageIdentifier === selectedPackageIdentifier) ?? null,
    [billing.plans, selectedPackageIdentifier],
  );

  useEffect(() => {
    if (!visible) return;
    setResult(null);
    setLegalDocument(null);
    billing.recordPaywallViewed(source);
    void billing.refresh();
  }, [billing.recordPaywallViewed, billing.refresh, source, visible]);

  useEffect(() => {
    if (!visible || billing.plans.length === 0) return;
    if (selectedPlan) return;
    const preferred = billing.plans.find((plan) => plan.period === "annual") ?? billing.plans[0];
    if (preferred) setSelectedPackageIdentifier(preferred.packageIdentifier);
  }, [billing.plans, selectedPlan, visible]);

  const selectPlan = (plan: BillingPlan) => {
    setSelectedPackageIdentifier(plan.packageIdentifier);
    setResult(null);
    billing.recordPlanSelected(plan);
    void Haptics.selectionAsync();
  };

  const purchase = async () => {
    if (!selectedPlan || busyAction) return;
    setBusyAction("purchase");
    setResult(null);
    const next = await billing.purchase(selectedPlan.packageIdentifier);
    setResult(next);
    setBusyAction(null);
    if (resultIsPositive(next)) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const restore = async () => {
    if (busyAction) return;
    setBusyAction("restore");
    setResult(null);
    const next = await billing.restore();
    setResult(next);
    setBusyAction(null);
    await Haptics.notificationAsync(
      resultIsPositive(next)
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning,
    );
  };

  const manage = async () => {
    if (busyAction) return;
    setBusyAction("manage");
    setResult(await billing.manage());
    setBusyAction(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <LinearGradient colors={["#0A0B14", "#12101C", "#090A12"]} style={styles.background}>
        <View style={styles.ambientCoral} />
        <View style={styles.ambientViolet} />
        {legalDocument ? (
          <LegalView document={legalDocument} onBack={() => setLegalDocument(null)} />
        ) : (
          <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
            <View style={styles.header}>
              <View style={styles.brandLockup}>
                <View style={styles.brandMark}>
                  <View style={styles.brandMarkInner} />
                </View>
                <Text style={styles.brand}>SAY IT FIRST</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Close Pro plans" onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeGlyph}>×</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.heroBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroBadgeText}>{billing.isPro ? "PRO IS ACTIVE" : "YOUR NEXT CONVERSATION"}</Text>
              </View>
              <Text style={styles.title}>
                {billing.isPro ? "Keep the room ready." : "Don’t wait for the stakes to practise."}
              </Text>
              <Text style={styles.subtitle}>
                {billing.isPro
                  ? "Your Pro access follows this Google Play account."
                  : "You’ve seen what one rehearsal can change. Pro keeps the practice room open when another difficult conversation arrives."}
              </Text>

              <View style={styles.benefitCard}>
                {benefits.map((benefit) => (
                  <View key={benefit} style={styles.benefitRow}>
                    <View style={styles.checkDisc}>
                      <Text style={styles.checkGlyph}>✓</Text>
                    </View>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {!billing.isPro ? (
                <View style={styles.plansSection} accessibilityRole="radiogroup">
                  <View style={styles.sectionHeadingRow}>
                    <Text style={styles.sectionHeading}>CHOOSE YOUR RHYTHM</Text>
                    {billing.status === "initializing" ? <ActivityIndicator color={palette.cyan} /> : null}
                  </View>
                  {billing.plans.map((plan) => (
                    <PlanCard
                      key={plan.packageIdentifier}
                      plan={plan}
                      selected={selectedPlan?.packageIdentifier === plan.packageIdentifier}
                      savings={plan.period === "annual" ? savings : null}
                      onPress={() => selectPlan(plan)}
                    />
                  ))}
                  {billing.plans.length === 0 && billing.status !== "initializing" ? (
                    <View style={styles.unavailableCard} accessibilityRole="alert">
                      <Text style={styles.unavailableTitle}>Plans aren’t available yet</Text>
                      <Text style={styles.unavailableBody}>{billing.message}</Text>
                      <Pressable accessibilityRole="button" onPress={() => void billing.refresh()} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry Google Play</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {result ? (
                <View
                  accessibilityRole="alert"
                  style={[styles.resultCard, resultIsPositive(result) && styles.resultCardPositive]}
                >
                  <Text style={styles.resultText}>{result.message}</Text>
                </View>
              ) : null}

              <View style={styles.actionArea}>
                {billing.isPro ? (
                  <Pressable
                    accessibilityRole="button"
                    disabled={busyAction !== null}
                    onPress={() => void manage()}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                  >
                    {busyAction === "manage" ? (
                      <ActivityIndicator color={palette.ink} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Manage Pro</Text>
                    )}
                  </Pressable>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    disabled={!selectedPlan || busyAction !== null}
                    onPress={() => void purchase()}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      (!selectedPlan || busyAction !== null) && styles.disabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    {busyAction === "purchase" ? (
                      <ActivityIndicator color={palette.ink} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>
                          {selectedPlan ? `Continue with ${selectedPlan.period}` : "Select a plan"}
                        </Text>
                        {selectedPlan ? <Text style={styles.primaryButtonPrice}>{selectedPlan.priceString}</Text> : null}
                      </>
                    )}
                  </Pressable>
                )}
                <Text style={styles.storeAssurance}>
                  Google Play shows the final price, renewal terms and eligibility before you confirm.
                </Text>
                <Pressable accessibilityRole="button" disabled={busyAction !== null} onPress={() => void restore()} style={styles.restoreButton}>
                  {busyAction === "restore" ? (
                    <ActivityIndicator color={palette.ivory} />
                  ) : (
                    <Text style={styles.restoreText}>Restore purchases</Text>
                  )}
                </Pressable>
                <Text style={styles.freeNote}>Free stays useful: two complete practices and basic evidence-linked feedback.</Text>
                <View style={styles.legalLinks}>
                  <Pressable accessibilityRole="link" onPress={() => setLegalDocument("terms")}>
                    <Text style={styles.legalLink}>Terms</Text>
                  </Pressable>
                  <View style={styles.legalDot} />
                  <Pressable accessibilityRole="link" onPress={() => setLegalDocument("privacy")}>
                    <Text style={styles.legalLink}>Privacy</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: palette.ink },
  ambientCoral: {
    position: "absolute",
    width: 310,
    height: 310,
    borderRadius: 155,
    top: -170,
    right: -110,
    backgroundColor: "rgba(255,107,95,0.16)",
  },
  ambientViolet: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: 70,
    left: -210,
    backgroundColor: "rgba(138,114,255,0.13)",
  },
  safeArea: { flex: 1 },
  header: {
    height: 62,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(255,156,133,0.52)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.coral },
  brand: { fontSize: 11, fontWeight: "800", letterSpacing: 2.1, color: palette.ivory },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
  },
  closeGlyph: { color: palette.ivory, fontSize: 25, lineHeight: 27, fontWeight: "300" },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.cyan },
  heroBadgeText: { ...typography.eyebrow, color: palette.cyan, letterSpacing: 1.8 },
  eyebrow: { ...typography.eyebrow, color: palette.coralLight },
  title: {
    ...typography.display,
    fontSize: 38,
    lineHeight: 41,
    color: palette.ivory,
    marginTop: 13,
    maxWidth: 350,
  },
  subtitle: { ...typography.body, color: palette.ivoryMuted, marginTop: spacing.md, maxWidth: 390 },
  benefitCard: {
    gap: 14,
    marginTop: spacing.lg,
    padding: 18,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: palette.line,
  },
  benefitRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  checkDisc: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "rgba(108,229,212,0.12)",
    borderWidth: 1,
    borderColor: "rgba(108,229,212,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkGlyph: { fontSize: 12, fontWeight: "800", color: palette.cyan },
  benefitText: { flex: 1, fontSize: 14, lineHeight: 20, color: palette.ivory },
  plansSection: { marginTop: spacing.lg, gap: 10 },
  sectionHeadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 24 },
  sectionHeading: { ...typography.eyebrow, color: palette.ivoryMuted, letterSpacing: 1.7 },
  planCard: {
    minHeight: 82,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    backgroundColor: palette.inkRaised,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  planCardSelected: {
    borderColor: palette.coral,
    backgroundColor: "rgba(255,107,95,0.09)",
    shadowColor: palette.coral,
    shadowOpacity: 0.14,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: palette.ivoryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { borderColor: palette.coral },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: palette.coral },
  planCopy: { flex: 1 },
  planTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  planTitle: { ...typography.label, color: palette.ivory },
  savingsPill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: palette.cyan },
  savingsText: { fontSize: 8, fontWeight: "900", letterSpacing: 0.7, color: palette.ink },
  planDescription: { fontSize: 10, lineHeight: 14, color: palette.ivoryMuted, marginTop: 4 },
  priceBlock: { alignItems: "flex-end", maxWidth: 95 },
  planPrice: { fontSize: 17, fontWeight: "700", color: palette.ivory },
  planPeriod: { fontSize: 9, color: palette.ivoryMuted, marginTop: 2 },
  unavailableCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(244,198,106,0.3)",
    backgroundColor: "rgba(244,198,106,0.07)",
  },
  unavailableTitle: { ...typography.label, color: palette.ivory },
  unavailableBody: { fontSize: 12, lineHeight: 18, color: palette.ivoryMuted, marginTop: 5 },
  retryButton: { alignSelf: "flex-start", marginTop: 12, paddingVertical: 8, paddingRight: 16 },
  retryButtonText: { ...typography.label, color: palette.amber, textDecorationLine: "underline" },
  resultCard: {
    marginTop: spacing.md,
    padding: 13,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(244,198,106,0.3)",
    backgroundColor: "rgba(244,198,106,0.07)",
  },
  resultCardPositive: { borderColor: "rgba(120,223,178,0.3)", backgroundColor: "rgba(120,223,178,0.08)" },
  resultText: { fontSize: 13, lineHeight: 19, color: palette.ivory },
  actionArea: { marginTop: spacing.lg, alignItems: "center" },
  primaryButton: {
    width: "100%",
    minHeight: 60,
    borderRadius: radius.md,
    backgroundColor: palette.coral,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: palette.coral,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 7,
  },
  primaryButtonText: { fontSize: 16, fontWeight: "800", color: palette.ink, textTransform: "capitalize" },
  primaryButtonPrice: { fontSize: 14, fontWeight: "700", color: "rgba(9,10,18,0.7)" },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  storeAssurance: { fontSize: 10, lineHeight: 15, color: palette.ivoryMuted, textAlign: "center", marginTop: 11, maxWidth: 330 },
  restoreButton: { minHeight: 45, minWidth: 170, alignItems: "center", justifyContent: "center", marginTop: 5 },
  restoreText: { ...typography.label, color: palette.ivory, textDecorationLine: "underline" },
  freeNote: { fontSize: 10, lineHeight: 15, color: palette.ivoryMuted, textAlign: "center", maxWidth: 330 },
  legalLinks: { flexDirection: "row", alignItems: "center", gap: 11, marginTop: 14 },
  legalLink: { fontSize: 11, color: palette.ivoryMuted, textDecorationLine: "underline" },
  legalDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: palette.ivoryMuted },
  legalSafeArea: { flex: 1 },
  legalHeader: { height: 62, paddingHorizontal: spacing.lg, flexDirection: "row", alignItems: "center", gap: 13 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: palette.line,
  },
  backGlyph: { fontSize: 21, color: palette.ivory },
  legalHeaderLabel: { ...typography.eyebrow, color: palette.ivoryMuted },
  legalContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  legalTitle: { ...typography.display, fontSize: 36, lineHeight: 40, color: palette.ivory, marginTop: 12 },
  legalUpdated: { fontSize: 11, color: palette.ivoryMuted, marginTop: 9, marginBottom: spacing.lg },
  legalParagraph: { ...typography.body, color: palette.ivoryMuted, marginBottom: spacing.md },
  legalNote: {
    fontSize: 12,
    lineHeight: 18,
    color: palette.amber,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(244,198,106,0.24)",
    backgroundColor: "rgba(244,198,106,0.06)",
  },
});
