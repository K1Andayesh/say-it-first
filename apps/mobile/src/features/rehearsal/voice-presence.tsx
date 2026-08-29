import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { palette, radius, typography } from "@/design/tokens";
import type { VoicePresence as VoicePresenceState } from "./use-rehearsal-controller";

const presenceCopy: Record<VoicePresenceState, string> = {
  quiet: "Room closed",
  listening: "Listening to you",
  thinking: "Considering your words",
  speaking: "Employee is responding",
};

type VoicePresenceProps = {
  state: VoicePresenceState;
  compact?: boolean;
};

export function VoicePresence({ state, compact = false }: VoicePresenceProps) {
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === "quiet") {
      breathe.stopAnimation();
      breathe.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: state === "speaking" ? 760 : 1_400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: state === "speaking" ? 760 : 1_400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [breathe, state]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.08] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.58] });

  return (
    <View style={[styles.root, compact && styles.rootCompact]} accessibilityLabel={presenceCopy[state]}>
      <Animated.View
        style={[
          styles.glow,
          compact && styles.glowCompact,
          { opacity: glowOpacity, transform: [{ scale }] },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={
            state === "speaking"
              ? [palette.coral, palette.violet]
              : [palette.violet, palette.cyan]
          }
          start={{ x: 0.05, y: 0.05 }}
          end={{ x: 0.95, y: 0.95 }}
          style={[styles.orb, compact && styles.orbCompact]}
        >
          <View style={[styles.orbInner, compact && styles.orbInnerCompact]}>
            <View style={styles.waveRow}>
              {[12, 24, 34, 22, 14].map((height, index) => (
                <View key={`${height}-${index}`} style={[styles.wave, { height }]} />
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      <View style={[styles.statusRow, compact && styles.statusRowCompact]}>
        <View style={[styles.dot, state === "quiet" && styles.dotQuiet]} />
        <Text style={styles.status}>{presenceCopy[state]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", minHeight: 214 },
  rootCompact: { minHeight: 136 },
  glow: {
    position: "absolute",
    width: 164,
    height: 164,
    borderRadius: 82,
    backgroundColor: palette.violet,
  },
  glowCompact: { width: 116, height: 116, borderRadius: 58 },
  orb: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.violet,
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 14,
  },
  orbCompact: { width: 94, height: 94, borderRadius: 47 },
  orbInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(9,10,18,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  orbInnerCompact: { width: 78, height: 78, borderRadius: 39 },
  waveRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  wave: { width: 3, borderRadius: radius.pill, backgroundColor: palette.ivory },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 27 },
  statusRowCompact: { marginTop: 13 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.cyan },
  dotQuiet: { backgroundColor: palette.ivoryMuted },
  status: { ...typography.label, color: palette.ivory },
});
