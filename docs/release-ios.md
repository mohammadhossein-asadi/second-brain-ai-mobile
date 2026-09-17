# iOS Build & Release Guide

Prepared on Windows — all iOS builds run on **EAS cloud builders**, no Mac or Xcode required.

## Current state

- `app.config.js` → `ios.bundleIdentifier: com.secondbrainai.mobile`, `buildNumber: 1`, `NSFaceIDUsageDescription` already set (needed later for biometric unlock).
- `eas.json` → three profiles:

| Profile | iOS target | Apple account needed? | Purpose |
|---|---|---|---|
| `development` | Physical device (dev client) | Yes | Daily development on a real device |
| `preview` | **Simulator** (`ios.simulator: true`) | **No** | Validate iOS builds today; Android keeps producing device APKs |
| `production` | App Store / TestFlight | Yes | Store submission, `autoIncrement: true` |

## 0. Validate the pipeline now (no Apple account needed)

```sh
npx eas build -p ios --profile preview
```

Produces a `.tar.gz` for the iOS Simulator. Requires only a free Expo account (`eas login` / signup at https://expo.dev). Free tier allows 30 queue runs/month.

## 1. When you have an Apple Developer account

```sh
npm i -g eas-cli          # or use npx eas-cli
eas login
eas init                  # links project, writes extra.eas.projectId into app.config.js
```

EAS manages signing credentials automatically (`remote` credentials). On the first device/store build you'll be prompted to generate keys/identifiers — accept the defaults unless you have existing certs.

### Build on a physical device

```sh
eas build -p ios --profile development
```

Requires the device's UDID registered (EAS walks you through it). Install via the link EAS prints, or with Expo Orbit.

### Release to TestFlight

```sh
eas build -p ios --profile production
eas submit -p ios --latest
```

`eas submit` needs an App Store Connect API key on first use (it prompts). TestFlight then requires a one-time TestFlight app record; App Store review applies only when you publish externally.

## 2. Notes

- `cli.appVersionSource: "remote"` — versions/build numbers are tracked on EAS servers; `production.autoIncrement` bumps `buildNumber` automatically.
- Apple Developer account ($99/yr) is required for **device** and **store** builds, not for the simulator build.
- Face ID permission string is in `app.config.js` under `ios.infoPlist.NSFaceIDUsageDescription` — update it if the biometric feature wording changes.
- **Quick-capture widget**: `src/plugins/withIosQuickCaptureWidget.js` adds a `SecondBrainWidget` WidgetKit extension during prebuild. The widget deep-links `secondbrain://quick-capture`, handled in `App.tsx` (opens `QuickCaptureModal`). The scheme is set via `scheme: "secondbrain"` in `app.config.js`. Test with `npx uri-scheme open secondbrain://quick-capture --ios` once a build is installed.
- If `eas build` complains about `projectId`, you skipped `eas init`.
