const fs = require("fs");
const path = require("path");
const xcode = require("xcode");
const { withDangerousMod } = require("@expo/config-plugins");

/**
 * Config plugin: adds an iOS WidgetKit extension ("SecondBrainWidget") with a
 * Quick Capture widget. Tapping the widget deep-links into the app via
 * secondbrain://quick-capture, which the app handles by opening QuickCaptureModal.
 *
 * MVP scope: launcher widget (no App Group data sharing yet).
 */

const WIDGET_NAME = "SecondBrainWidget";
const SWIFT_FILES = ["SecondBrainWidgetBundle.swift", "QuickCaptureWidget.swift"];
const INFO_PLIST_NAME = `${WIDGET_NAME}-Info.plist`;

const WIDGET_BUNDLE_SWIFT = `import WidgetKit
import SwiftUI

@main
struct SecondBrainWidgetBundle: WidgetBundle {
    var body: some Widget {
        QuickCaptureWidget()
    }
}
`;

const QUICK_CAPTURE_SWIFT = `import WidgetKit
import SwiftUI

struct QuickCaptureEntry: TimelineEntry {
    let date: Date
}

struct QuickCaptureProvider: TimelineProvider {
    func placeholder(in context: Context) -> QuickCaptureEntry {
        QuickCaptureEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (QuickCaptureEntry) -> Void) {
        completion(QuickCaptureEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuickCaptureEntry>) -> Void) {
        completion(Timeline(entries: [QuickCaptureEntry(date: Date())], policy: .never))
    }
}

struct QuickCaptureEntryView: View {
    var entry: QuickCaptureEntry

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "square.and.pencil")
                .font(.system(size: 40, weight: .medium))
                .foregroundStyle(Color.white)
            Text("Quick Capture")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(Color.white.opacity(0.85))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .widgetBackground()
        .widgetURL(URL(string: "secondbrain://quick-capture"))
    }
}

struct QuickCaptureWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "SecondBrainQuickCapture", provider: QuickCaptureProvider()) { entry in
            QuickCaptureEntryView(entry: entry)
        }
        .configurationDisplayName("Quick Capture")
        .description("Tap to capture a note, task, or idea instantly.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

extension View {
    @ViewBuilder
    func widgetBackground() -> some View {
        let gradient = LinearGradient(
            colors: [
                Color(red: 0.04, green: 0.055, blue: 0.09),
                Color(red: 0.06, green: 0.11, blue: 0.24)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        if #available(iOSApplicationExtension 17.0, *) {
            containerBackground(for: .widget) { gradient }
        } else {
            background(gradient)
        }
    }
}
`;

const WIDGET_INFO_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>$(DEVELOPMENT_LANGUAGE)</string>
	<key>CFBundleDisplayName</key>
	<string>Quick Capture</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
	<key>CFBundleShortVersionString</key>
	<string>$(MARKETING_VERSION)</string>
	<key>CFBundleVersion</key>
	<string>$(CURRENT_PROJECT_VERSION)</string>
	<key>NSExtension</key>
	<dict>
		<key>NSExtensionPointIdentifier</key>
		<string>com.apple.widgetkit-extension</string>
	</dict>
</dict>
</plist>
`;

function writeWidgetFiles(platformDir) {
  const widgetDir = path.join(platformDir, WIDGET_NAME);
  fs.mkdirSync(widgetDir, { recursive: true });
  fs.writeFileSync(path.join(widgetDir, "SecondBrainWidgetBundle.swift"), WIDGET_BUNDLE_SWIFT);
  fs.writeFileSync(path.join(widgetDir, "QuickCaptureWidget.swift"), QUICK_CAPTURE_SWIFT);
  fs.writeFileSync(path.join(widgetDir, INFO_PLIST_NAME), WIDGET_INFO_PLIST);
}

function widgetTargetExists(proj, name) {
  const section = proj.hash.project.objects.PBXNativeTarget || {};
  for (const key of Object.keys(section)) {
    if (key.endsWith("_comment")) continue;
    const existing = String(section[key].name || "").replace(/^"|"$/g, "");
    if (existing === name) return true;
  }
  return false;
}

function addWidgetTarget(projectRoot, config) {
  const iosDir = path.join(projectRoot, "ios");
  const xcodeprojDir = fs
    .readdirSync(iosDir)
    .find((name) => name.endsWith(".xcodeproj"));
  if (!xcodeprojDir) {
    throw new Error("iOS project not found — expected ios/*.xcodeproj");
  }

  const pbxprojPath = path.join(iosDir, xcodeprojDir, "project.pbxproj");
  const proj = xcode.project(pbxprojPath);
  proj.parseSync();

  // Idempotency: skip target creation if a previous prebuild already added it
  if (widgetTargetExists(proj, WIDGET_NAME)) {
    return;
  }

  const bundleId = config.ios && config.ios.bundleIdentifier
    ? config.ios.bundleIdentifier
    : config.slug;
  const marketingVersion = config.version || "1.0.0";
  const buildNumber = String((config.ios && config.ios.buildNumber) || "1");
  const deploymentTarget =
    proj.getBuildProperty("IPHONEOS_DEPLOYMENT_TARGET", "Release") || "15.1";

  // The xcode lib silently skips dependency creation when these sections are
  // missing (fresh Expo projects have neither) — pre-create them.
  const objects = proj.hash.project.objects;
  if (!objects.PBXTargetDependency) objects.PBXTargetDependency = {};
  if (!objects.PBXContainerItemProxy) objects.PBXContainerItemProxy = {};

  const widgetTarget = proj.addTarget(WIDGET_NAME, "app_extension", WIDGET_NAME, `${bundleId}.${WIDGET_NAME}`);
  const targetUuid = widgetTarget.uuid;

  // The xcode lib stores the target name pre-quoted ('"Name"'), which pollutes
  // the comment key and breaks target lookups. Normalize to match how the
  // parser stores Xcode-authored projects.
  const nativeTarget = widgetTarget.pbxNativeTarget;
  nativeTarget.name = WIDGET_NAME;
  nativeTarget.productName = WIDGET_NAME;
  const nativeTargetSection = proj.hash.project.objects.PBXNativeTarget;
  delete nativeTargetSection[`${targetUuid}_comment`];
  nativeTargetSection[`${targetUuid}_comment`] = WIDGET_NAME;

  // Build phases (Sources must exist before addSourceFile wiring)
  proj.addBuildPhase([], "PBXSourcesBuildPhase", "Sources", targetUuid);
  proj.addBuildPhase([], "PBXFrameworksBuildPhase", "Frameworks", targetUuid);
  proj.addBuildPhase([], "PBXResourcesBuildPhase", "Resources", targetUuid);

  // Extra settings the xcode lib does not set for us
  const configListUuid = widgetTarget.pbxNativeTarget.buildConfigurationList;
  const configList = proj.pbxXCConfigurationList()[configListUuid];
  const buildConfigUuids = configList.buildConfigurations.map((c) => c.value);
  const configs = proj.pbxXCBuildConfigurationSection();
  for (const uuid of buildConfigUuids) {
    const settings = configs[uuid].buildSettings;
    settings.SWIFT_VERSION = '"5.0"';
    settings.TARGETED_DEVICE_FAMILY = '"1,2"';
    settings.CODE_SIGN_STYLE = "Automatic";
    settings.MARKETING_VERSION = `"${marketingVersion}"`;
    settings.CURRENT_PROJECT_VERSION = `"${buildNumber}"`;
    settings.INFOPLIST_FILE = `"${WIDGET_NAME}/${INFO_PLIST_NAME}"`;
    if (!settings.IPHONEOS_DEPLOYMENT_TARGET) {
      settings.IPHONEOS_DEPLOYMENT_TARGET = `"${deploymentTarget}"`;
    }
  }

  // Group in the Xcode navigator, attached to the main group
  const group = proj.addPbxGroup([], WIDGET_NAME, WIDGET_NAME);
  const mainGroupKey = proj.getFirstProject().firstProject.mainGroup;
  const mainGroup = proj.hash.project.objects.PBXGroup[mainGroupKey];
  if (mainGroup && !mainGroup.children.some((c) => c.value === group.uuid)) {
    mainGroup.children.push({ value: group.uuid, comment: WIDGET_NAME });
  }

  // Swift sources into the group + widget target's Sources phase
  for (const file of SWIFT_FILES) {
    proj.addSourceFile(file, { target: targetUuid }, group.uuid);
  }
  // Info.plist: file reference only, never compiled
  proj.addFile(INFO_PLIST_NAME, group.uuid);

  fs.writeFileSync(pbxprojPath, proj.writeSync());
}

module.exports = function withIosQuickCaptureWidget(config) {
  return withDangerousMod(config, [
    "ios",
    (modConfig) => {
      writeWidgetFiles(modConfig.modRequest.platformProjectRoot);
      addWidgetTarget(modConfig.modRequest.platformProjectRoot, modConfig);
      return modConfig;
    },
  ]);
};

// Exposed for direct testing outside of prebuild (e.g., against fixture pbxproj)
module.exports.__internals = { writeWidgetFiles, addWidgetTarget };
