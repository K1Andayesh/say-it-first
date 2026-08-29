import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { TranscriptTurn } from "@say-it-first/contracts";

import { palette, radius, spacing, typography } from "@/design/tokens";

type TranscriptPanelProps = {
  transcript: readonly TranscriptTurn[];
  compact?: boolean;
};

export function TranscriptPanel({ transcript, compact = false }: TranscriptPanelProps) {
  const visibleTurns = transcript.slice(-3);

  return (
    <View style={[styles.panel, compact && styles.panelCompact]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>LIVE NOTES</Text>
        <Text style={styles.privateLabel}>ON THIS SCREEN</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleTurns.length === 0 ? (
          <Text style={styles.empty}>
            Start with the real sentence. Your words will appear here as the rehearsal unfolds.
          </Text>
        ) : (
          visibleTurns.map((turn) => (
            <View key={turn.id} style={styles.turn}>
              <Text style={[styles.speaker, turn.speaker === "user" && styles.speakerYou]}>
                {turn.speaker === "user" ? "YOU" : "ALEX"}
              </Text>
              <Text style={styles.copy} numberOfLines={3}>
                {turn.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    minHeight: 188,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: "rgba(17,18,29,0.88)",
    padding: spacing.md,
  },
  panelCompact: { minHeight: 112 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  eyebrow: { ...typography.eyebrow, color: palette.ivoryMuted, letterSpacing: 1.7 },
  privateLabel: { fontSize: 9, fontWeight: "700", letterSpacing: 1.35, color: palette.cyan },
  scroll: { flex: 1, maxHeight: 132 },
  scrollContent: { paddingTop: spacing.sm, gap: spacing.sm },
  empty: { ...typography.body, fontSize: 14, lineHeight: 21, color: palette.ivoryMuted },
  turn: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  speaker: {
    width: 39,
    paddingTop: 3,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: palette.violet,
  },
  speakerYou: { color: palette.coralLight },
  copy: { flex: 1, fontSize: 14, lineHeight: 20, color: palette.ivory },
});
