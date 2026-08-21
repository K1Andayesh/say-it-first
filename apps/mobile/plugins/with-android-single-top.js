const { AndroidConfig, withAndroidManifest } = require("@expo/config-plugins");

/**
 * Keeps Google Play purchase verification alive when the user temporarily opens a banking app.
 * RevenueCat supports `standard` and `singleTop`; Expo defaults to `singleTask`.
 *
 * Development builds retain Expo's `singleTask` default so the dev client can discover and open
 * its local URL scheme. Store-shaped preview and production builds use `singleTop`.
 */
module.exports = function withAndroidSingleTop(config) {
  if (config.extra?.appVariant === "development") return config;

  return withAndroidManifest(config, (manifestConfig) => {
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(manifestConfig.modResults);
    mainActivity.$["android:launchMode"] = "singleTop";
    return manifestConfig;
  });
};
