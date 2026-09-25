import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ContentReportReason, TranscriptTurn } from "@say-it-first/contracts";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, radius, spacing, typography } from "@/design/tokens";
import { reportAiContent } from "@/services/api/api-client";

const reasons: readonly { value: ContentReportReason; label: string }[] = [
  { value: "harmful_advice", label: "Harmful or unsafe advice" },
  { value: "harassment", label: "Harassment or hostility" },
  { value: "discrimination", label: "Discrimination or bias" },
  { value: "sexual_content", label: "Sexual content" },
  { value: "other", label: "Something else" },
];

type ContentReportModalProps = {
  visible: boolean;
  turn: TranscriptTurn | null;
  scenarioId: string;
  personaId: string;
  onClose: () => void;
};

export function ContentReportModal({
  visible,
  turn,
  scenarioId,
  personaId,
  onClose,
}: ContentReportModalProps) {
  const [reason, setReason] = useState<ContentReportReason | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  useEffect(() => {
    if (!visible) return;
    setReason(null);
    setStatus("idle");
  }, [turn?.id, visible]);

  const submit = async () => {
    if (!turn || !reason || status === "sending") return;
    setStatus("sending");
    try {
      await reportAiContent({
        scenarioId,
        personaId,
        assistantTurnId: turn.id,
        assistantText: turn.text.trim().slice(0, 2_000),
        reason,
      });
      setStatus("sent");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setStatus("failed");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>SAFETY FEEDBACK</Text>
            <Text style={styles.title}>Report AI response</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close report"
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeGlyph}>×</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {status === "sent" ? (
            <View style={styles.confirmation} accessibilityRole="alert">
              <Text style={styles.confirmationMark}>✓</Text>
              <Text style={styles.confirmationTitle}>Report received</Text>
              <Text style={styles.confirmationBody}>
                Thank you. We’ll use it to investigate and improve Alex’s safeguards.
              </Text>
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.intro}>
                Choose what was wrong with Alex’s latest response. Reports help us review unsafe or inappropriate AI content.
              </Text>

              <View style={styles.responseCard}>
                <Text style={styles.responseLabel}>RESPONSE BEING REPORTED</Text>
                <Text style={styles.responseText} numberOfLines={8}>
                  {turn?.text ?? "No Alex response is available to report."}
                </Text>
              </View>

              <Text style={styles.reasonLabel}>WHAT WAS WRONG?</Text>
              <View style={styles.reasonList} accessibilityRole="radiogroup">
                {reasons.map((item) => {
                  const selected = reason === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      onPress={() => {
                        setReason(item.value);
                        setStatus("idle");
                      }}
                      style={({ pressed }) => [
                        styles.reasonButton,
                        selected && styles.reasonButtonSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected ? <View style={styles.radioDot} /> : null}
                      </View>
                      <Text style={styles.reasonText}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.privacyCard}>
                <Text style={styles.privacyTitle}>What gets sent</Text>
                <Text style={styles.privacyBody}>
                  Only the Alex response shown above, your selected reason, and safety identifiers. Your microphone audio and other transcript turns are not included. Reports are retained for 30 days.
                </Text>
              </View>

              {status === "failed" ? (
                <Text style={styles.error} accessibilityRole="alert">
                  The report didn’t send. Check your connection and try again.
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={!turn || !reason || status === "sending"}
                onPress={() => void submit()}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (!turn || !reason || status === "sending") && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                {status === "sending" ? (
                  <ActivityIndicator color={palette.ink} />
                ) : (
                  <Text style={styles.primaryButtonText}>Send report</Text>
                )}
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.ink },
  header: {
    minHeight: 76,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  eyebrow: { ...typography.eyebrow, color: palette.coralLight, letterSpacing: 1.6 },
  title: { ...typography.title, color: palette.ivory, marginTop: 4 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  closeGlyph: { color: palette.ivory, fontSize: 25, lineHeight: 27, fontWeight: "300" },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  intro: { ...typography.body, color: palette.ivoryMuted },
  responseCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(138,114,255,0.34)",
    backgroundColor: "rgba(138,114,255,0.08)",
  },
  responseLabel: { ...typography.eyebrow, color: "#B9ACFF", letterSpacing: 1.45 },
  responseText: { fontSize: 15, lineHeight: 22, color: palette.ivory, marginTop: 10 },
  reasonLabel: { ...typography.eyebrow, color: palette.ivoryMuted, letterSpacing: 1.5, marginTop: spacing.lg },
  reasonList: { gap: 9, marginTop: 10 },
  reasonButton: {
    minHeight: 54,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: radius.sm,
    backgroundColor: palette.inkRaised,
  },
  reasonButtonSelected: { borderColor: palette.coral, backgroundColor: "rgba(255,107,95,0.09)" },
  radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, borderColor: palette.ivoryMuted, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: palette.coral },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.coral },
  reasonText: { ...typography.label, color: palette.ivory, flex: 1 },
  privacyCard: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.sm, backgroundColor: "rgba(108,229,212,0.07)", borderWidth: 1, borderColor: "rgba(108,229,212,0.22)" },
  privacyTitle: { ...typography.label, color: palette.cyan },
  privacyBody: { fontSize: 12, lineHeight: 18, color: palette.ivoryMuted, marginTop: 6 },
  error: { fontSize: 12, lineHeight: 18, color: palette.coralLight, marginTop: spacing.md },
  primaryButton: { minHeight: 58, borderRadius: radius.md, backgroundColor: palette.coral, alignItems: "center", justifyContent: "center", marginTop: spacing.lg, paddingHorizontal: 20 },
  primaryButtonText: { fontSize: 16, fontWeight: "800", color: palette.ink },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  confirmation: { alignItems: "center", paddingTop: 60 },
  confirmationMark: { width: 58, height: 58, textAlign: "center", textAlignVertical: "center", borderRadius: 29, backgroundColor: "rgba(108,229,212,0.13)", color: palette.cyan, fontSize: 28 },
  confirmationTitle: { ...typography.title, color: palette.ivory, marginTop: spacing.lg },
  confirmationBody: { ...typography.body, color: palette.ivoryMuted, textAlign: "center", marginTop: spacing.sm, maxWidth: 330 },
});
