import type { ExpoConfig } from "expo/config";

const configuredAndroidPackage: unknown = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;
const androidPackage =
  typeof configuredAndroidPackage === "string" && configuredAndroidPackage.trim()
    ? configuredAndroidPackage.trim()
    : "com.devectus.sayitfirst.dev";

const config: ExpoConfig = {
  name: "Say It First · Lab",
  slug: "say-it-first",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "sayitfirst",
  userInterfaceStyle: "dark",
  android: {
    package: androidPackage,
    adaptiveIcon: {
      backgroundColor: "#0A0A12",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    permissions: ["android.permission.RECORD_AUDIO"],
  },
  plugins: [
    "expo-dev-client",
    ["expo-secure-store", { configureAndroidBackup: false }],
    "@config-plugins/react-native-webrtc",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#0A0A12",
        image: "./assets/images/splash-icon.png",
        imageWidth: 72,
      },
    ],
  ],
  extra: {
    privacy: {
      rawAudioRetained: false,
      transcriptServerPersistence: false,
    },
  },
};

export default config;
