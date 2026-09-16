# مغز دوم — Second Brain AI 🧠

<div align="center">

**Personal Knowledge Management OS — in your pocket**

**سیستم‌عامل شخصی مدیریت دانش و بهره‌وری — نسخه اندروید**

![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2-06B6D4?logo=tailwindcss&logoColor=white)
![MMKV](https://img.shields.io/badge/Storage-MMKV-orange)
![License](https://img.shields.io/badge/License-MIT-green.svg)

🌐 **Web version:** [second-brain-ai](https://github.com/mohammadhossein-asadi/second-brain-ai) — the original browser edition (React 19 + Vite + Express) of this project.

</div>

---

## 📖 About / دربارهٔ برنامه

**Second Brain AI (مغز دوم)** is a full-featured Personal Knowledge Management "operating system" for Android, built with React Native + Expo. It implements the *Building a Second Brain* methodology — **Capture → Organize → Connect → Retrieve → Act** — as a native mobile app with an integrated multi-provider AI copilot running **fully on-device** (no server required).

This repository is the **Android edition**. The original web edition (React 19 + Vite + Express, server-side AI) lives in [second-brain-ai](https://github.com/mohammadhossein-asadi/second-brain-ai) — both share the same feature set, design language, and data key schema.

---

## ✨ Features

### 🗂️ 14 Knowledge Modules

| Module | Highlights |
|---|---|
| **Dashboard** | Bento grid, KPI metrics, weekly activity charts, progress rings, daily journal & affirmation, cognitive load sparkline |
| **Notes** | Markdown editor + preview, note types (idea / meeting / book summary / bookmark), pinning, AI auto-tagging, AI category suggestions, AI one-sentence summaries, AI smart-link suggestions to projects & contacts |
| **Tasks** | List view with drag-and-drop reordering, Kanban board, calendar view, priority/status badges, smart reminder suggestions |
| **Projects** | PARA-style categories, task-linked progress bars, archive/restore, start/end dates |
| **Goals** | Yearly / 6-month / monthly timeframes, progress bars, linked tasks |
| **Habits** | Daily check-off grid (last 7 days), 49-day consistency heatmap, streak tracking, streak comparison charts |
| **Contacts** | Personal CRM with relationship levels, follow-up dates, phone/email/telegram/linkedin |
| **Skills** | Hard/soft skills, 5-star levels, learning/mastered status |
| **Resources** | Books, courses, podcasts, websites — with ratings and reading status |
| **Income** | Active & passive income streams, monthly totals, currencies |
| **Self-Awareness** | Documentaries / books / articles / reflections + **AI journal sentiment & mood trend analysis** |
| **Knowledge Graph** | Interactive SVG graph of notes ↔ projects ↔ goals with zoom, filters, and detail inspector |
| **Automation** | Rule engine with triggers, enable/disable, test runs, run counters |
| **Export / Import** | Full JSON backup & restore, Markdown export (Obsidian-ready), reset to defaults |

### 🤖 AI Copilot (standalone — no server required)

- **14 AI providers** built in, with automatic multi-provider **fallback chain**
- Real-time **token streaming** in chat
- The copilot is connected to your entire knowledge base (tasks, projects, goals, habits, notes) via context injection
- Journal **sentiment & mood analysis** with an offline heuristic engine as fallback
- **Provider Settings** screen: manage API keys on-device at runtime

| Provider | Type | Models |
|---|---|---|
| Google Gemini | REST | `gemini-3.8-flash`, `gemini-2.5-flash` |
| OpenAI | OpenAI-compatible | `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo` (3-key rotation) |
| OpenRouter | OpenAI-compatible | GPT-4o, Claude, DeepSeek R1 |
| Hugging Face / DeepSeek | OpenAI-compatible | `DeepSeek-R1`, `DeepSeek-V3` |
| Groq Cloud | OpenAI-compatible | `llama-3.3-70b-versatile` |
| Mistral AI | OpenAI-compatible | `mistral-large-latest` |
| SambaNova | OpenAI-compatible | `Meta-Llama-3.1-70B` |
| LLM7 | OpenAI-compatible | `default`, `fast`, `pro` |
| GLM / Z.ai | OpenAI-compatible | `glm-4-9b-chat` |
| Ollama (Cloud/Local) | OpenAI-compatible | `gpt-oss:120b`, `llama3.2` |
| BazaarLink / Aion Labs | OpenAI-compatible | Enterprise proxies |
| GitHub | REST | Profile & developer sync |

> If no provider is configured (or all fail), a built-in **local intelligence engine** answers using your own data — the app is never dead in the water.

### 📱 Native mobile experience

- 🔐 **Vault lock** — PIN protection with configurable auto-lock (default: 30 min)
- ⏱️ **Pomodoro timer** with sessions counter, haptic completion feedback
- 🌐 **Full RTL support** — Persian-first UI with Vazirmatn font, instant FA ⇄ EN switching
- 🌗 **Dark / light theme** everywhere
- 📴 **Offline-first** — all data stored locally (MMKV), works fully offline with connection status banner
- 🔔 Pull-to-refresh, toasts, command palette (⌘K-style, touch-first), quick capture, web clipper, keyboard-shortcut guide
- 💾 **Data ownership** — JSON backup/restore + Markdown export; no telemetry, no accounts, no cloud dependency

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Expo SDK 57** (dev client), React Native 0.86, React 19 |
| Language | TypeScript (strict) |
| Styling | NativeWind 4.2 (Tailwind CSS 3.4) + CSS-variable design tokens |
| State | Single React Context (`SecondBrainContext`) with ~50 slices, persisted to **MMKV** (synchronous, same key schema as the web version) |
| AI | In-app provider manager — direct REST calls, SSE token streaming via `expo/fetch` |
| Charts | `react-native-gifted-charts`, `react-native-svg` |
| Gestures / DnD | `react-native-gesture-handler`, `react-native-draggable-flatlist`, `react-native-reanimated` |
| Fonts | Vazirmatn (bundled, 6 weights) |
| Storage | `react-native-mmkv` (Nitro modules) |
| Native modules | `expo-speech`, `expo-haptics`, `expo-file-system`, `expo-sharing`, `expo-document-picker`, `expo-clipboard`, `expo-notifications`, `expo-font`, `@react-native-community/netinfo` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 22**
- An **Expo account** (free at [expo.dev](https://expo.dev)) — for cloud builds
- An Android device (7+) or emulator

### 1. Clone & install

```bash
git clone https://github.com/mohammadhossein-asadi/second-brain-ai-mobile.git
cd second-brain-ai-mobile
npm install
```

### 2. Configure AI keys (optional)

```bash
cp .env.example .env
# then edit .env and add the provider keys you have
```

Keys are bundled into the app at build time and can also be added/overridden later inside the app via **Header → ⚙️ Provider Settings** (stored only on-device).

### 3. Build the development client

Since the app uses native modules (MMKV, Reanimated, Worklets), it does **not** run in Expo Go. Build a development client:

```bash
# cloud build — no Android Studio required
npx eas-cli build -p android --profile development
```

…or locally if you have the Android SDK:

```bash
npx expo run:android
```

Install the produced APK on your device, then start the dev server:

```bash
npx expo start --dev-client
```

### 4. Production build

```bash
# installable APK (internal testing)
npx eas-cli build -p android --profile preview

# Play Store AAB
npx eas-cli build -p android --profile production
```

---

## 🔐 Security & Privacy

- All data lives **only on your device** (MMKV storage, `second_brain_v1_*` key schema) — no servers, no analytics
- AI provider keys are stored locally and used only for **direct calls to the providers you choose**
- Vault PIN protects the whole knowledge base with automatic inactivity lock
- JSON/Markdown backups are created on-device and shared through the Android share sheet

---

## 📁 Project Structure

```
second-brain-ai-mobile/
├── App.tsx                      # Root: fonts, providers, layout, overlays
├── app.config.js                # Expo config (name, RTL plugin, AI keys from .env)
├── global.css                   # Tailwind + design tokens (light/dark CSS variables)
├── tailwind.config.js           # NativeWind theme (layout color mappings)
├── eas.json                     # EAS build profiles (development / preview / production)
└── src/
    ├── context/                 # SecondBrainContext — global state (~50 slices)
    ├── services/ai/             # In-app AI engine: 14 providers, fallback, streaming
    ├── lib/                     # storage (MMKV), theme tokens, file helpers
    ├── i18n/                    # Full FA/EN dictionaries
    ├── data/                    # Seed data
    ├── types/                   # Domain types
    ├── utils/                   # View tracking, smart suggestions
    ├── plugins/                 # Expo config plugin (Android RTL)
    └── components/
        ├── views/               # 14 screens + sections + skeletons
        ├── modals/              # Command palette, quick capture, vault, clipper, AI settings
        ├── layout/              # Sidebar drawer, header, breadcrumbs, Pomodoro
        ├── ai/                  # Assistant drawer, chat items, link suggester
        ├── ui/                  # Primitives kit, toasts, error boundary
        └── dashboard/           # Dashboard widgets
```

---

## 🗺️ Roadmap

- [ ] iOS build & release
- [ ] Biometric vault unlock
- [ ] Widget for quick capture
- [ ] End-to-end encrypted backup sync (optional)

---

## 📄 License

[MIT](LICENSE) — built with [Expo](https://expo.dev).
