/**
 * Audio/haptic feedback for RN — native counterpart of the web app's
 * Web-Audio `playAutoSaveChime`. Uses expo-haptics for a soft confirmation
 * pulse (no external audio file required).
 */
import * as Haptics from "expo-haptics";

export function playAutoSaveChime(_volume = 0.08): void {
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  } catch (err) {
    console.debug("Chime playback was suppressed:", err);
  }
}
