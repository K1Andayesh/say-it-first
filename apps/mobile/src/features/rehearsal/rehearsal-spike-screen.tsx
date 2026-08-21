import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, radius, spacing, typography } from "@/design/tokens";
import { TranscriptPanel } from "./transcript-panel";
import { useRehearsalController } from "./use-rehearsal-controller";
import { VoicePresence } from "./voice-presence";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

type PrimaryButtonProps = {
  label: string;
  hint?: string;
  onPress: () => void;
  disabled?: boolean;
};

function PrimaryButton({ label, hint, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && styles.primaryButtonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <View>
        <Text style={styles.primaryButtonLabel}>{label}</Text>
        {hint ? <Text style={styles.primaryButtonHint}>{hint}</Text> : null}
      </View>
      <View style={styles.arrowDisc}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Pressable>
  );
}

function TrustRow() {
  return (
    <View style={styles.trustRow}>
      <View style={styles.trustItem}>
        <Text style={styles.trustIcon}>○</Text>
        <Text style={styles.trustCopy}>Audio isn’t stored</Text>
      </View>
      <View style={styles.trustDivider} />
      <View style={styles.trustItem}>
        <Text style={styles.trustIcon}>“</Text>
        <Text style={styles.trustCopy}>Feedback cites your words</Text>
      </View>
    </View>
  );
}

export function RehearsalSpikeScreen() {
  const controller = useRehearsalController();
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const state = controller.sessionState;
  const isLanding = state === "idle" || state === "blocked" || state === "connection_failed";
  const isResults = state === "completed";
  const isFeedbackError = state === "evaluation_failed" || state === "interrupted";
  const isConnecting = state === "authorising" || state === "connecting";
  const isEvaluating = state === "ending" || state === "evaluating";
  const isLive = ["ready", "active", "paused"].includes(state);

  return (
    <LinearGradient
      colors={["#090A12", "#10101A", "#090A12"]}
      locations={[0, 0.48, 1]}
      style={styles.background}
    >
      <View style={styles.ambientTop} />
      <View style={styles.ambientBottom} />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}>
              <View style={styles.brandMarkInner} />
            </View>
            <Text style={styles.brand}>SAY IT FIRST</Text>
          </View>
          <View style={styles.checkpointPill}>
            <View style={styles.checkpointDot} />
            <Text style={styles.checkpointText}>PRIVATE LAB</Text>
          </View>
        </View>

        {isLanding ? (
          <ScrollView
            contentContainerStyle={[styles.landingContent, compact && styles.landingContentCompact]}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={styles.eyebrow}>PRIVATE MANAGER REHEARSAL</Text>
              <Text style={[styles.hero, compact && styles.heroCompact]}>
                The conversation isn’t the place to practice.
              </Text>
              <Text style={styles.heroBody}>
                Rehearse the words out loud with a realistic employee. Leave with one clearer way to
                say what matters.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <LinearGradient
                colors={["rgba(255,107,95,0.22)", "rgba(138,114,255,0.08)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.scenarioTopline}>
                <Text style={styles.scenarioNumber}>01</Text>
                <View style={styles.scenarioMetaRow}>
                  <Text style={styles.scenarioMeta}>4 MIN</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.scenarioMeta}>DEFENSIVE</Text>
                </View>
              </View>
              <Text style={styles.scenarioLabel}>TODAY’S REHEARSAL</Text>
              <Text style={styles.scenarioTitle}>{controller.scenario.title}</Text>
              <Text style={styles.scenarioDescription}>{controller.scenario.shortDescription}</Text>
              <View style={styles.roleRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>A</Text>
                </View>
                <View style={styles.roleCopy}>
                  <Text style={styles.roleName}>Alex · Software engineer</Text>
                  <Text style={styles.roleDetail}>Will push back if you stay vague</Text>
                </View>
              </View>
            </View>

            {controller.error ? (
              <View style={styles.errorCard} accessibilityRole="alert">
                <Text style={styles.errorTitle}>{controller.error.title}</Text>
                <Text style={styles.errorMessage}>{controller.error.message}</Text>
              </View>
            ) : null}

            <View style={styles.actionStack}>
              <PrimaryButton
                label={isConnecting ? "Opening the rehearsal room…" : "Begin private rehearsal"}
                hint="You’ll speak, not type"
                onPress={() => void controller.start()}
                disabled={isConnecting}
              />
              <TrustRow />
            </View>
          </ScrollView>
        ) : null}

        {isLive || isConnecting || isEvaluating ? (
          <View style={styles.liveContent}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionHeaderText}>
                <Text style={styles.eyebrow}>UNDERPERFORMANCE FEEDBACK</Text>
                <Text style={styles.sessionTitle}>
                  {isEvaluating ? "Turning the rehearsal into useful feedback" : "Say the real sentence."}
                </Text>
              </View>
              <Text style={styles.timer}>{formatTime(controller.elapsedSeconds)}</Text>
            </View>

            <VoicePresence
              state={isConnecting || isEvaluating ? "thinking" : controller.voicePresence}
            />

            <TranscriptPanel transcript={controller.transcript} />

            {controller.error ? (
              <View style={styles.inlineError} accessibilityRole="alert">
                <Text style={styles.inlineErrorCopy}>{controller.error.message}</Text>
              </View>
            ) : null}

            <View style={styles.liveControls}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={controller.muted ? "Unmute microphone" : "Mute microphone"}
                onPress={controller.toggleMute}
                disabled={!isLive}
                style={({ pressed }) => [
                  styles.secondaryControl,
                  controller.muted && styles.secondaryControlActive,
                  pressed && styles.controlPressed,
                  !isLive && styles.buttonDisabled,
                ]}
              >
                <View style={styles.micGlyph}>
                  <View style={styles.micCapsule} />
                  <View style={styles.micStem} />
                </View>
                <Text style={styles.secondaryControlLabel}>
                  {controller.muted ? "Unmute" : "Mute"}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="End rehearsal and get feedback"
                onPress={() => void controller.end()}
                disabled={!isLive}
                style={({ pressed }) => [
                  styles.endControl,
                  pressed && styles.controlPressed,
                  !isLive && styles.buttonDisabled,
                ]}
              >
                <View style={styles.stopGlyph} />
                <Text style={styles.endControlLabel}>
                  {isEvaluating ? "Preparing feedback…" : "End & reflect"}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.livePrivacy}>MICROPHONE CONNECTION CLOSES WHEN YOU END OR LEAVE</Text>
          </View>
        ) : null}

        {isResults && controller.evaluation ? (
          <ScrollView contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>YOUR PRIVATE DEBRIEF</Text>
            <Text style={styles.resultsTitle}>Keep the truth. Sharpen the delivery.</Text>
            <Text style={styles.resultsSummary}>{controller.evaluation.summary}</Text>

            {controller.evaluation.strongestMoment ? (
              <View style={styles.evidenceCard}>
                <View style={styles.evidenceLabelRow}>
                  <View style={styles.evidenceDot} />
                  <Text style={styles.evidenceLabel}>STRONGEST MOMENT</Text>
                </View>
                <Text style={styles.quote}>“{controller.evaluation.strongestMoment.quote}”</Text>
                <Text style={styles.evidenceExplanation}>
                  {controller.evaluation.strongestMoment.explanation}
                </Text>
              </View>
            ) : null}

            {controller.evaluation.suggestedNextSentence ? (
              <View style={styles.nextSentenceCard}>
                <Text style={styles.nextSentenceLabel}>TRY THIS NEXT</Text>
                <Text style={styles.nextSentence}>“{controller.evaluation.suggestedNextSentence}”</Text>
              </View>
            ) : null}

            <View style={styles.resultsAction}>
              <PrimaryButton label="Rehearse it again" onPress={controller.reset} />
              <Text style={styles.resultsPrivacy}>Nothing was sent to your workplace.</Text>
            </View>
          </ScrollView>
        ) : null}

        {isFeedbackError ? (
          <View style={styles.recoveryContent}>
            <View style={styles.recoveryIcon}>
              <Text style={styles.recoveryIconText}>↺</Text>
            </View>
            <Text style={styles.eyebrow}>SESSION CLOSED SAFELY</Text>
            <Text style={styles.recoveryTitle}>{controller.error?.title ?? "Your rehearsal is paused"}</Text>
            <Text style={styles.recoveryBody}>
              {controller.error?.message ?? "You can request feedback or begin a fresh rehearsal."}
            </Text>
            <View style={styles.recoveryActions}>
              {controller.transcript.some((turn) => turn.speaker === "user") ? (
                <PrimaryButton label="Retry private feedback" onPress={() => void controller.end()} />
              ) : null}
              <Pressable accessibilityRole="button" onPress={controller.reset} style={styles.textButton}>
                <Text style={styles.textButtonLabel}>Start a fresh rehearsal</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: palette.ink },
  ambientTop: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(138,114,255,0.12)",
  },
  ambientBottom: {
    position: "absolute",
    bottom: -210,
    left: -140,
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "rgba(255,107,95,0.08)",
  },
  safeArea: { flex: 1 },
  topBar: {
    height: 62,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: palette.ivory,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.coral },
  brand: { fontSize: 11, fontWeight: "800", letterSpacing: 2.1, color: palette.ivory },
  checkpointPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: palette.line,
  },
  checkpointDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.cyan },
  checkpointText: { fontSize: 8, fontWeight: "800", letterSpacing: 1.45, color: palette.ivoryMuted },
  landingContent: { paddingHorizontal: spacing.lg, paddingTop: 27, paddingBottom: spacing.xl, gap: 28 },
  landingContentCompact: { paddingTop: spacing.md, gap: 21 },
  eyebrow: { ...typography.eyebrow, color: palette.coralLight },
  hero: { ...typography.display, color: palette.ivory, marginTop: 14, maxWidth: 370 },
  heroCompact: { fontSize: 34, lineHeight: 38 },
  heroBody: { ...typography.body, color: palette.ivoryMuted, marginTop: spacing.md, maxWidth: 370 },
  scenarioCard: {
    overflow: "hidden",
    minHeight: 253,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    backgroundColor: "rgba(17,18,29,0.9)",
    padding: spacing.lg,
  },
  scenarioTopline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  scenarioNumber: { fontSize: 12, fontWeight: "700", color: palette.coralLight },
  scenarioMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  scenarioMeta: { fontSize: 9, fontWeight: "700", letterSpacing: 1.25, color: palette.ivoryMuted },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: palette.ivoryMuted },
  scenarioLabel: { ...typography.eyebrow, color: palette.ivoryMuted, marginTop: 27, letterSpacing: 1.65 },
  scenarioTitle: { ...typography.title, color: palette.ivory, marginTop: 6, textTransform: "capitalize" },
  scenarioDescription: { fontSize: 14, lineHeight: 21, color: palette.ivoryMuted, marginTop: 7 },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 19,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(138,114,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(138,114,255,0.5)",
  },
  avatarText: { fontSize: 15, fontWeight: "700", color: palette.ivory },
  roleCopy: { flex: 1 },
  roleName: { ...typography.label, color: palette.ivory },
  roleDetail: { fontSize: 12, color: palette.ivoryMuted, marginTop: 3 },
  errorCard: {
    borderLeftWidth: 3,
    borderLeftColor: palette.danger,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255,102,95,0.09)",
    padding: spacing.md,
  },
  errorTitle: { ...typography.label, color: palette.ivory },
  errorMessage: { fontSize: 13, lineHeight: 19, color: palette.ivoryMuted, marginTop: 4 },
  actionStack: { gap: spacing.md },
  primaryButton: {
    minHeight: 70,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: palette.coral,
    shadowColor: palette.coral,
    shadowOpacity: 0.26,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  primaryButtonPressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },
  primaryButtonLabel: { fontSize: 16, fontWeight: "700", color: palette.ink },
  primaryButtonHint: { fontSize: 11, color: "rgba(9,10,18,0.65)", marginTop: 3 },
  arrowDisc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(9,10,18,0.13)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: { fontSize: 21, lineHeight: 22, color: palette.ink },
  buttonDisabled: { opacity: 0.48 },
  trustRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 11 },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  trustIcon: { fontSize: 11, fontWeight: "800", color: palette.cyan },
  trustCopy: { fontSize: 10, color: palette.ivoryMuted },
  trustDivider: { width: 1, height: 12, backgroundColor: palette.lineStrong },
  liveContent: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  sessionHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sessionHeaderText: { flex: 1, paddingRight: spacing.md },
  sessionTitle: { ...typography.title, color: palette.ivory, marginTop: 8 },
  timer: { fontSize: 13, fontVariant: ["tabular-nums"], letterSpacing: 1, color: palette.ivoryMuted },
  inlineError: {
    marginTop: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255,102,95,0.08)",
    padding: spacing.sm,
  },
  inlineErrorCopy: { fontSize: 12, lineHeight: 17, color: palette.coralLight },
  liveControls: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  secondaryControl: {
    minWidth: 102,
    height: 57,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    backgroundColor: palette.inkRaised,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryControlActive: { borderColor: palette.coral, backgroundColor: "rgba(255,107,95,0.1)" },
  secondaryControlLabel: { ...typography.label, color: palette.ivory },
  endControl: {
    flex: 1,
    height: 57,
    borderRadius: radius.md,
    backgroundColor: palette.ivory,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  endControlLabel: { ...typography.label, color: palette.ink },
  controlPressed: { transform: [{ scale: 0.975 }], opacity: 0.88 },
  micGlyph: { width: 15, height: 21, alignItems: "center" },
  micCapsule: {
    width: 8,
    height: 13,
    borderRadius: 5,
    borderWidth: 1.4,
    borderColor: palette.ivory,
  },
  micStem: { width: 10, height: 5, borderBottomWidth: 1.4, borderColor: palette.ivory },
  stopGlyph: { width: 11, height: 11, borderRadius: 2, backgroundColor: palette.ink },
  livePrivacy: {
    textAlign: "center",
    fontSize: 8,
    letterSpacing: 1.1,
    color: palette.ivoryMuted,
    marginTop: 11,
  },
  resultsContent: { paddingHorizontal: spacing.lg, paddingTop: 25, paddingBottom: spacing.xl },
  resultsTitle: { ...typography.display, fontSize: 36, lineHeight: 40, color: palette.ivory, marginTop: 12 },
  resultsSummary: { ...typography.body, color: palette.ivoryMuted, marginTop: spacing.md },
  evidenceCard: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(108,229,212,0.28)",
    backgroundColor: "rgba(108,229,212,0.07)",
    padding: 20,
  },
  evidenceLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  evidenceDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.cyan },
  evidenceLabel: { ...typography.eyebrow, letterSpacing: 1.6, color: palette.cyan },
  quote: { fontSize: 21, lineHeight: 29, fontWeight: "500", color: palette.ivory, marginTop: spacing.md },
  evidenceExplanation: { fontSize: 13, lineHeight: 20, color: palette.ivoryMuted, marginTop: 12 },
  nextSentenceCard: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.inkSoft,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 20,
  },
  nextSentenceLabel: { ...typography.eyebrow, letterSpacing: 1.6, color: palette.coralLight },
  nextSentence: { fontSize: 18, lineHeight: 27, color: palette.ivory, marginTop: 10 },
  resultsAction: { marginTop: spacing.lg, gap: 12 },
  resultsPrivacy: { textAlign: "center", fontSize: 11, color: palette.ivoryMuted },
  recoveryContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: 80,
  },
  recoveryIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,107,95,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,107,95,0.3)",
    marginBottom: spacing.lg,
  },
  recoveryIconText: { fontSize: 26, color: palette.coralLight },
  recoveryTitle: { ...typography.display, fontSize: 34, lineHeight: 39, color: palette.ivory, marginTop: 12 },
  recoveryBody: { ...typography.body, color: palette.ivoryMuted, marginTop: spacing.md },
  recoveryActions: { gap: spacing.sm, marginTop: spacing.xl },
  textButton: { alignItems: "center", justifyContent: "center", minHeight: 48 },
  textButtonLabel: { ...typography.label, color: palette.ivory, textDecorationLine: "underline" },
});
