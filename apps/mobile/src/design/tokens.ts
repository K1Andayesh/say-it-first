export const palette = {
  ink: "#090A12",
  inkRaised: "#11121D",
  inkSoft: "#191A27",
  line: "rgba(255,255,255,0.10)",
  lineStrong: "rgba(255,255,255,0.18)",
  ivory: "#F4F0E8",
  ivoryMuted: "#B8B4AE",
  coral: "#FF6B5F",
  coralLight: "#FF9C85",
  violet: "#8A72FF",
  cyan: "#6CE5D4",
  amber: "#F4C66A",
  danger: "#FF665F",
  success: "#78DFB2",
  transparent: "transparent",
} as const;

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 12, md: 18, lg: 26, pill: 999 } as const;

export const typography = {
  eyebrow: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 2.2,
    textTransform: "uppercase" as const,
  },
  display: {
    fontSize: 39,
    lineHeight: 43,
    fontWeight: "600" as const,
    letterSpacing: -1.8,
  },
  title: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "600" as const,
    letterSpacing: -0.6,
  },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  label: { fontSize: 14, lineHeight: 19, fontWeight: "600" as const },
} as const;
