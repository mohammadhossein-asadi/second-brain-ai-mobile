# Porting Guide: Web (React DOM + Tailwind) → React Native (Expo + NativeWind)

You are porting one file of a web app to React Native (Expo SDK 57, RN 0.86, React 19).
The web original is at `C:\Users\MohammadHossein\Desktop\projects\second-brain-ai\`.
The mobile app is at `C:\Users\MohammadHossein\Desktop\projects\second-brain-ai-mobile\`.
Write ports with the SAME relative path under the mobile app's `src/` folder.

## Available infrastructure (already ported — import and use)

- Context: `src/context/SecondBrainContext.tsx` — `useSecondBrain()` has FULL feature parity with the web:
  language/isRTL/t (translations), activeView/setActiveView, theme/setTheme/toggleTheme, toasts/showToast/dismissToast,
  isCommandPaletteOpen/isQuickCaptureOpen/isWebClipperOpen/isAIAssistantOpen/isShortcutsModalOpen (+setters),
  all CRUD (projects, tasks, goals, habits, contacts, skills, resources, notes, incomeSources, selfAwareness, automationRules, suggestions),
  generateTagsForNote, suggestCategoriesForNote, suggestLinksForNote, generateOneSentenceSummary, generateMissingNoteSummaries,
  syncData/isSyncing, incomeStreams aliases, aiProviders/selectedAIProvider/setSelectedAIProvider/loadAIProviders,
  githubProfile/loadGitHubProfile, chatMessages/isChatLoading/sendChatMessage/clearChatHistory, isDataLoading,
  refreshDashboardData, exportFullBackupJSON, downloadBackupJSON, importFullBackupJSON, resetToDefaults,
  isLocked/lockVault/unlockVault/vaultPin/setVaultPin/autoLockMinutes/setAutoLockMinutes/lastActiveTime,
  reorderTasks, isOffline, lastOfflineSyncTimestamp.
- UI kit: `src/components/ui/primitives.tsx` exports: `T` (Text with Vazirmatn font + RTL writingDirection),
  `TBold`, `Input` (TextInput), `Btn` (title/onPress/variant: primary|success|danger|outline|ghost|neutral, icon, size, loading, disabled, fullWidth),
  `IconBtn`, `Select` (value/options[{value,label}]/onChange), `Toggle` (value/onValueChange), `Card`, `ModalShell` (visible/onClose/children/maxWidth),
  `Spinner`, `ProgressBar` (progress/color/height), `ScrollView`.
- Theme colors: `src/lib/theme.ts` — `useThemeColors()` returns `{ bgMain, bgSurface, bgElevated, bgSubtle, bgHover, cardSurface, cardHover, borderColor, borderSubtle, borderHover, textPrimary, textSecondary, textMuted, textSubtle, navbarBg, navbarBorder, navbarBtnBg, navbarBtnBorder, navbarBtnText, sidebarBg, sidebarBorder, sidebarItemText, sidebarItemActiveText, accentBlue, accentBlueSubtle, accentEmerald, accentEmeraldSubtle }`. `modalColors` for always-dark modal chrome.
- Storage: `src/lib/storage.ts` — `storage.getItem/setItem/removeItem` (replaces localStorage; same key names).
- Files: `src/lib/files.ts` — `writeAndShareFile(contents, filename, mimeType)`, `pickAndReadTextFile(mime)`, `backupFilename(prefix, ext)`.
- AI: `src/services/ai` — `aiService` (getProviders, generateContent, generateContentStream(req, onChunk), suggestNoteCategories, generateOneSentenceSummary, suggestRelatedLinks, analyzeJournalSentiment, autoTagNote, getGitHubProfile), `getApiKey/setApiKey/clearApiKey`.
- Tailwind is available via NativeWind: `className` works on RN core components (View, Text, Pressable, etc.).

## Mapping rules (apply in this order)

1. **Elements:** `div/section/aside/main/nav/header/footer` → `View`; `span/p/h1..h6/label/li/td/th` → `T` or `TBold`;
   `button` → `Btn` or `Pressable`; `input` → `Input`; `textarea` → `Input multiline`; `select` → `Select`; `a` → `Pressable` (+ `Linking.openURL` from react-native when it was href);
   checkbox → `Pressable` wrapping a styled box + `Check` icon from lucide; `input type=range` → `Slider` from `@react-native-community/slider`; `table` → flex-row Views.
2. **Icons:** `lucide-react` → `lucide-react-native`. Same component names. Replace `className="h-4 w-4"` with `size={16}` and add `color={"#94a3b8"}` matching the text color class. `stroke-[3]` → `strokeWidth={3}`. Wrap app root in `<SafeAreaProvider>` (already in App.tsx).
3. **Events:** `onClick` → `onPress`; `onChange={e=>set(e.target.value)}` → `onChangeText={set}`; checkbox `checked`/`onChange` → local state + Pressable toggle; `onSubmit` → `onSubmitEditing` where relevant.
4. **Classes:** keep Tailwind classes that map to RN layout (flex, grid→flex/flexWrap, w-*, h-*, p-*, m-*, rounded-*, border, gap-*, text-[10px] sizes, font-bold, colors like text-neutral-400, bg-blue-600/10, etc. — NativeWind supports arbitrary values).
   - DROP (unsupported): `backdrop-blur*`, `hover:*`, `group-hover:*`, `focus:*`, `transition*`, `animate-in fade-in duration-*`, `sm:/md:/lg:` responsive prefixes (this is a phone app — pick the mobile layout: single column, full width), `sticky` (use absolute/flex), `overflow-y-auto` (wrap in ScrollView), `shadow-*` (use `shadowColor/shadowOpacity` style or drop), `divide-*` (manual borders), `cursor-*`, `scrollbar`.
   - `space-x-*` / `space-y-*` → `gap-*` on the parent.
   - `grid grid-cols-N` → `flex-row flex-wrap` with children `width: (100/N)%` via `style={{ width: `${100/N}%` }}` or percentage-based flexBasis.
   - `fixed inset-0` overlays → use `ModalShell` from primitives (for modals) or `absolute inset-0` inside a full-screen container.
   - `hidden md:flex` etc → keep only the mobile version.
   - Colors via CSS variables: keep `bg-layout-main`, `bg-layout-surface`, `bg-layout-elevated`, `bg-layout-subtle`, `border-layout`, `border-layout-subtle`, `text-layout-primary`, `text-layout-secondary`, `text-layout-muted`, `text-layout-subtle`, `bento-card`, `sidebar-surface`, `navbar-surface` — these ARE configured in the mobile Tailwind theme.
   - For style objects referencing theme colors use `useThemeColors()`.
5. **Browser APIs → Native:**
   - `localStorage.getItem/setItem/removeItem` → `import { storage } from "../../lib/storage"` (adjust relative depth).
   - `navigator.clipboard.writeText(x)` → `import * as Clipboard from "expo-clipboard"; Clipboard.setStringAsync(x)`.
   - `window.speechSynthesis` → `import * as Speech from "expo-speech"` (`Speech.speak(text, { language: isRTL ? "fa-IR" : "en-US" })`, `Speech.stop()`).
   - `AudioContext` chime → `import * as Haptics from "expo-haptics"` (`Haptics.notificationAsync()`) + `import * as Notifications from "expo-notifications"` where a reminder exists.
   - Blob download (`<a download>`) → `writeAndShareFile` from `../../lib/files`.
   - FileReader import → `pickAndReadTextFile("application/json")`.
   - `window.addEventListener("keydown")` → OMIT (touch UI covers it; header/sidebar buttons exist).
   - `navigator.onLine` → `isOffline` from context.
   - `document.title` / meta — omit.
6. **RTL:** components receive `isRTL` from context. Mirror directional layouts with `style={{ flexDirection: isRTL ? "row-reverse" : "row" }}` when the original relied on `dir=rtl` mirroring, and `textAlign: isRTL ? "right" : "left"`. Use the `T` component which already sets writingDirection.
7. **Animation:** `motion` imports → `import { motion, AnimatePresence } from "motion/react-native"`. Most simple transitions can be dropped if problematic — prefer static layout on mobile. Do NOT use framer-motion web-only props (drag on div etc.).
8. **Charts:** `recharts` → `react-native-gifted-charts` (`LineChart`, `BarChart`, `PieChart`) with data mapped from the same arrays. Colors from `useThemeColors()`.
9. **Reordering (dnd-kit):** use `react-native-draggable-flatlist` (`DraggableFlatList`, `ScaleDecorator`, `RenderItemParams`) for SortableTaskRow/TasksView; call `reorderTasks` from context after drag.
10. **Markdown:** `react-markdown` → `import Markdown from "react-native-markdown-display"` with a style object built from `useThemeColors()`.
11. **Syntax highlighting (prismjs):** replace highlighted code blocks with plain monospaced `T` (color #d1d5db on #0b0f1a bg) — visual parity acceptable.
12. **The web app sometimes conditionally returns null for closed modals (`if (!isOpen) return null`)** — in RN use `ModalShell visible={isOpen}` instead; keep all inner logic.
13. **Scrollable page bodies:** each view's root becomes `<ScrollView className="flex-1 bg-layout-main" contentContainerStyle={{ padding: 16 }}>` (with `refreshControl={<RefreshControl refreshing={...} onRefresh={...}/>} when the view has pull-to-refresh semantics`).

## Verification (REQUIRED)

After writing your files, run from the mobile project root:
`npx tsc --noEmit`
Fix ALL errors caused by your files (ignore errors from files you did not write — report them instead).
Do not change shared infrastructure files (primitives, context, storage, theme, services) — if something is missing there, report it.

## Return

Report: files written, typecheck status, any intentional deviations or missing infrastructure.
