import React, { useState } from "react";
import { View, Pressable, ScrollView, Alert } from "react-native";
import {
  Download,
  Upload,
  Database,
  FileText,
  RotateCcw,
} from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { writeAndShareFile, pickAndReadTextFile, backupFilename } from "../../lib/files";
import { T, Btn } from "../ui/primitives";

export const ExportView: React.FC = () => {
  const {
    notes,
    tasks,
    projects,
    goals,
    habits,
    downloadBackupJSON,
    importFullBackupJSON,
    resetToDefaults,
    isRTL,
    t,
  } = useSecondBrain();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = () => {
    downloadBackupJSON();
  };

  const handleExportMarkdownNotes = async () => {
    const locale = isRTL ? "fa-IR" : "en-US";
    let mdContent = `# Second Brain Notes Backup\n\nExport Date: ${new Date().toLocaleDateString(locale)}\nTotal Notes: ${notes.length}\n\n---\n\n`;

    notes.forEach((note, index) => {
      mdContent += `## ${index + 1}. ${note.title}\n`;
      mdContent += `*Type:* ${note.type} | *Tags:* ${note.tags.join(", ")} | *Date:* ${note.updatedAt}\n\n`;
      if (note.summary) {
        mdContent += `> **Summary:** ${note.summary}\n\n`;
      }
      mdContent += `${note.content}\n\n---\n\n`;
    });

    try {
      await writeAndShareFile(
        mdContent,
        `second_brain_notes_${new Date().toISOString().split("T")[0]}.md`,
        "text/markdown"
      );
      setImportStatus(null);
    } catch {
      // ignore
    }
  };

  const handleFileImport = async () => {
    try {
      const content = await pickAndReadTextFile("application/json");
      if (!content) return;
      const result = importFullBackupJSON(content);
      setImportStatus(result.success ? t.views.export.restoreSuccess : t.views.export.restoreError);
    } catch {
      setImportStatus(t.views.export.restoreError);
    }
  };

  const confirmReset = () => {
    Alert.alert(t.views.export.resetTitle, t.views.export.resetDesc, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.views.export.resetButton, style: "destructive", onPress: resetToDefaults },
    ]);
  };

  const StatCard = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <View
      style={{
        width: "31%",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "rgba(10,10,10,0.7)",
        padding: 16,
        alignItems: "center",
      }}
    >
      <T style={{ fontSize: 22, fontWeight: "700", color: "#60a5fa" }}>{value}</T>
      <T style={{ marginTop: 4, fontSize: 12, color: "#a3a3a3" }}>{label}</T>
    </View>
  );

  return (
    <View className="gap-6 pb-12">
      {/* Top Banner */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
          <View className="h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
            <Database size={24} color="#60a5fa" />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>{t.views.export.title}</T>
            <T style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>{t.views.export.subtitle}</T>
          </View>
        </View>
      </View>

      {/* Database Statistics */}
      <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
        <T style={{ fontSize: 12, fontWeight: "700", color: "#d4d4d4", marginBottom: 16, letterSpacing: 1 }}>
          {t.views.export.metricsTitle}
        </T>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <StatCard value={notes.length} label={t.nav.notes} color="#60a5fa" />
          <StatCard value={tasks.length} label={t.nav.tasks} color="#fbbf24" />
          <StatCard value={projects.length} label={t.nav.projects} color="#22d3ee" />
          <StatCard value={goals.length} label={t.nav.goals} color="#c084fc" />
          <StatCard value={habits.length} label={t.nav.habits} color="#60a5fa" />
        </View>
      </View>

      {/* Export & Import Action Cards */}
      <View className="gap-5">
        {/* Export JSON */}
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <View className="h-10 w-10 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
              <Download size={20} color="#60a5fa" />
            </View>
            <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
              {t.views.export.exportJsonTitle}
            </T>
          </View>
          <T style={{ marginTop: 12, fontSize: 12, color: "#a3a3a3", lineHeight: 19 }}>
            {t.views.export.exportJsonDesc}
          </T>
          <Btn
            title={t.views.export.exportJsonButton}
            onPress={handleExportJSON}
            icon={<Download size={16} color="#ffffff" />}
            fullWidth
            style={{ marginTop: 20 }}
          />
        </View>

        {/* Export Markdown Notes */}
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <View className="h-10 w-10 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
              <FileText size={20} color="#22d3ee" />
            </View>
            <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
              {t.views.export.exportMdTitle}
            </T>
          </View>
          <T style={{ marginTop: 12, fontSize: 12, color: "#a3a3a3", lineHeight: 19 }}>
            {t.views.export.exportMdDesc}
          </T>
          <Btn
            title={t.views.export.exportMdButton}
            onPress={handleExportMarkdownNotes}
            variant="neutral"
            icon={<Download size={16} color="#ffffff" />}
            fullWidth
            style={{ marginTop: 20 }}
          />
        </View>

        {/* Restore from JSON */}
        <View className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <View className="h-10 w-10 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950">
              <Upload size={20} color="#fbbf24" />
            </View>
            <T style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
              {t.views.export.restoreTitle}
            </T>
          </View>
          <T style={{ marginTop: 12, fontSize: 12, color: "#a3a3a3", lineHeight: 19 }}>
            {t.views.export.restoreDesc}
          </T>
          <View style={{ marginTop: 20 }}>
            <Btn
              title={t.views.export.restoreButton}
              onPress={handleFileImport}
              variant="neutral"
              icon={<Upload size={16} color="#d4d4d4" />}
              fullWidth
            />
            {importStatus ? (
              <T style={{ marginTop: 8, fontSize: 12, fontWeight: "600", color: "#60a5fa" }}>
                {importStatus}
              </T>
            ) : null}
          </View>
        </View>

        {/* Reset to defaults */}
        <View className="rounded-3xl border border-rose-950/60 bg-rose-950/15 p-6">
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <View className="h-10 w-10 items-center justify-center rounded-2xl border border-rose-900/60 bg-rose-950/60">
              <RotateCcw size={20} color="#fb7185" />
            </View>
            <T style={{ fontSize: 13, fontWeight: "700", color: "#fda4af" }}>
              {t.views.export.resetTitle}
            </T>
          </View>
          <T style={{ marginTop: 12, fontSize: 12, color: "rgba(253,164,175,0.7)", lineHeight: 19 }}>
            {t.views.export.resetDesc}
          </T>
          <Btn
            title={t.views.export.resetButton}
            onPress={confirmReset}
            variant="danger"
            icon={<RotateCcw size={16} color="#ffffff" />}
            fullWidth
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    </View>
  );
};
