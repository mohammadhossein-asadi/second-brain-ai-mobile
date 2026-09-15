const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Config plugin: ensures android:supportsRtl="true" in the merged manifest
 * so the Persian (RTL) layout renders correctly in release builds.
 */
module.exports = function withAndroidRtl(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    if (manifest.manifest && manifest.manifest.$) {
      manifest.manifest.$["android:supportsRtl"] = "true";
    }
    return config;
  });
};
