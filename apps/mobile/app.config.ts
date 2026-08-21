import type { ExpoConfig } from "expo/config";

const configuredAndroidPackage: unknown = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;
const configuredAppVariant: unknown = process.env.APP_VARIANT;
const appVariant =
  typeof configuredAppVariant === "string" && configuredAppVariant.trim()
    ? configuredAppVariant.trim().toLowerCase()
    : "development";
const productionBuild = appVariant === "production";
const androidPackage =
  typeof configuredAndroidPackage === "string" && configuredAndroidPackage.trim()
    ? configuredAndroidPackage.trim()
    : productionBuild
      ? "app.sayitfirst"
      : "app.sayitfirst.dev";

const config: ExpoConfig = {
  name: productionBuild ? "Say It First" : "Say It First · Lab",
  slug: "say-it-first",
  owner: "keyvan.andayesh",
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
    permissions: ["android.permission.RECORD_AUDIO", "com.android.vending.BILLING"],
  },
  plugins: [
    "expo-dev-client",
    ["expo-secure-store", { configureAndroidBackup: false }],
    "@config-plugins/react-native-webrtc",
    "./plugins/with-android-single-top",
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
    appVariant,
    eas: {
      projectId: "6a409046-9ac7-4b14-8a32-efa1ff614091",
    },
    billing: {
      entitlementIdentifier: "Pro",
      offeringIdentifier: "default",
    },
    privacy: {
      rawAudioRetained: false,
      transcriptServerPersistence: false,
    },
  },
};

export default config;
