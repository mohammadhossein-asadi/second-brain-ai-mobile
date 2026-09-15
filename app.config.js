const fs = require("fs");
const path = require("path");

// Minimal .env loader (KEY=VALUE lines) — reads .env.local then .env
function loadEnv(file) {
  const full = path.resolve(__dirname, file);
  if (!fs.existsSync(full)) return {};
  const out = {};
  for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith("#")) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnv(".env"), ...loadEnv(".env.local") };

module.exports = {
  expo: {
    name: "مغز دوم",
    slug: "second-brain-ai-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],
    ios: { supportsTablet: true },
    android: {
      package: "com.secondbrainai.mobile",
      versionCode: 1,
      adaptiveIcon: {
        backgroundColor: "#0a0e17",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Vazirmatn-Regular.ttf",
            "./assets/fonts/Vazirmatn-Medium.ttf",
            "./assets/fonts/Vazirmatn-SemiBold.ttf",
            "./assets/fonts/Vazirmatn-Bold.ttf",
            "./assets/fonts/Vazirmatn-Light.ttf",
            "./assets/fonts/Vazirmatn-ExtraBold.ttf",
          ],
        },
      ],
      "expo-audio",
      "expo-sharing",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#0a0e17",
          image: "./assets/icon.png",
          imageWidth: 200,
          dark: { backgroundColor: "#0a0e17", image: "./assets/icon.png", imageWidth: 200 },
        },
      ],
      [
        "./src/plugins/withAndroidRtl.js",
        {},
      ],
    ],
    experiments: { typedRoutes: false },
    extra: {
      // AI provider keys bundled for standalone (personal) use.
      // In-app Provider Settings can override these at runtime.
      ai: {
        GEMINI_API_KEY: env.GEMINI_API_KEY || "",
        HF_DEEPSEEK_API_KEY: env.HF_DEEPSEEK_API_KEY || "",
        HF_GLM_API_KEY: env.HF_GLM_API_KEY || "",
        GLM_API_KEY: env.GLM_API_KEY || "",
        HUGGINGFACE_API_KEY: env.HUGGINGFACE_API_KEY || "",
        OPENROUTER_API_KEY: env.OPENROUTER_API_KEY || "",
        OPENAI_API_KEY_1: env.OPENAI_API_KEY_1 || "",
        OPENAI_API_KEY_2: env.OPENAI_API_KEY_2 || "",
        OPENAI_API_KEY_3: env.OPENAI_API_KEY_3 || "",
        BAZAARLINK_API_KEY: env.BAZAARLINK_API_KEY || "",
        AIONLABS_API_KEY: env.AIONLABS_API_KEY || "",
        MISTRAL_API_KEY: env.MISTRAL_API_KEY || "",
        GROQ_API_KEY: env.GROQ_API_KEY || "",
        LLM7_API_KEY: env.LLM7_API_KEY || "",
        OLLAMA_API_KEY: env.OLLAMA_API_KEY || "",
        SAMBANOVA_API_KEY: env.SAMBANOVA_API_KEY || "",
        GITHUB_TOKEN: env.GITHUB_TOKEN || "",
      },
    },
  },
};
