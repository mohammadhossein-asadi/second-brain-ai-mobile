import React, { useState, useRef, useCallback } from "react";
import { View, Pressable, Modal as RNModal, Animated } from "react-native";
import { Lock, KeyRound, Delete, AlertCircle, Clock, CheckCircle2 } from "lucide-react-native";
import { useSecondBrain } from "../../context/SecondBrainContext";
import { T, TBold, Input } from "../ui/primitives";

type KeypadKey = { key: string; kind: "digit" | "del" | "ok" };

const KEYPAD_ROWS: KeypadKey[][] = [
  [
    { key: "1", kind: "digit" },
    { key: "2", kind: "digit" },
    { key: "3", kind: "digit" },
  ],
  [
    { key: "4", kind: "digit" },
    { key: "5", kind: "digit" },
    { key: "6", kind: "digit" },
  ],
  [
    { key: "7", kind: "digit" },
    { key: "8", kind: "digit" },
    { key: "9", kind: "digit" },
  ],
  [
    { key: "del", kind: "del" },
    { key: "0", kind: "digit" },
    { key: "ok", kind: "ok" },
  ],
];

export const VaultLockScreen: React.FC = () => {
  const {
    isLocked,
    unlockVault,
    vaultPin,
    setVaultPin,
    autoLockMinutes,
    isRTL,
  } = useSecondBrain();
  const [pinInput, setPinInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const runShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const failAttempt = useCallback(
    (message: string) => {
      setIsShaking(true);
      setErrorMsg(message);
      runShake();
      setTimeout(() => {
        setIsShaking(false);
        setPinInput("");
      }, 600);
    },
    [runShake]
  );

  // Handle digit press (auto-check 4-digit PIN, same as web)
  const handleDigit = useCallback(
    (digit: string) => {
      if (pinInput.length < 8) {
        setErrorMsg(null);
        const nextPin = pinInput + digit;
        setPinInput(nextPin);
        if (nextPin.length === 4) {
          setTimeout(() => {
            const success = unlockVault(nextPin);
            if (!success) {
              failAttempt(
                isRTL ? "رمز عبور اشتباه است (پیش‌فرض: ۱۲۳۴)" : "Incorrect PIN (Default: 1234)"
              );
            } else {
              setPinInput("");
              setErrorMsg(null);
            }
          }, 120);
        }
      }
    },
    [pinInput, unlockVault, isRTL, failAttempt]
  );

  const handleDelete = useCallback(() => {
    setErrorMsg(null);
    setPinInput((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setErrorMsg(null);
    setPinInput("");
  }, []);

  // On-screen OK button — replaces the web's physical-keyboard Enter submission
  const handleOk = useCallback(() => {
    if (pinInput.length === 0) return;
    const success = unlockVault(pinInput);
    if (!success) {
      failAttempt(isRTL ? "رمز عبور اشتباه است" : "Incorrect PIN");
    } else {
      setPinInput("");
      setErrorMsg(null);
    }
  }, [pinInput, unlockVault, isRTL, failAttempt]);

  const handleQuickUnlock = () => {
    const success = unlockVault("1234");
    if (success) {
      setPinInput("");
      setErrorMsg(null);
    }
  };

  const handleChangePinSubmit = () => {
    if (newPin.length < 4) {
      setErrorMsg(isRTL ? "رمز عبور باید حداقل ۴ رقم باشد" : "PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg(isRTL ? "تکرار رمز عبور همخوانی ندارد" : "PINs do not match");
      return;
    }
    setVaultPin(newPin);
    setPinChangeSuccess(true);
    setTimeout(() => {
      setIsChangingPin(false);
      setPinChangeSuccess(false);
      setNewPin("");
      setConfirmPin("");
    }, 1500);
  };

  if (!isLocked) return null;

  const renderKey = (item: KeypadKey) => {
    if (item.kind === "digit") {
      return (
        <Pressable
          key={item.key}
          onPress={() => handleDigit(item.key)}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#262626",
            backgroundColor: pressed ? "rgba(37,99,235,0.2)" : "rgba(10,10,10,0.6)",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <T style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>{item.key}</T>
        </Pressable>
      );
    }
    if (item.kind === "del") {
      return (
        <Pressable
          key={item.key}
          onPress={handleDelete}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(38,38,38,0.6)",
            backgroundColor: pressed ? "rgba(38,38,38,0.6)" : "rgba(10,10,10,0.4)",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <Delete size={16} color="#a3a3a3" />
        </Pressable>
      );
    }
    return (
      <Pressable
        key={item.key}
        onPress={handleOk}
        style={({ pressed }) => ({
          flex: 1,
          height: 48,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(59,130,246,0.4)",
          backgroundColor: pressed ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.15)",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <T style={{ fontSize: 13, fontWeight: "700", color: "#60a5fa" }}>OK</T>
      </Pressable>
    );
  };

  return (
    <RNModal visible={isLocked} transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <View style={{ flex: 1, backgroundColor: "rgba(10,10,10,0.92)" }}>
        {/* Ambient background light glows (blur unsupported — flat translucent circles) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: "18%",
            alignSelf: "center",
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: "rgba(37,99,235,0.12)",
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: "18%",
            alignSelf: "center",
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: "rgba(79,70,229,0.08)",
          }}
        />

        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: "100%",
              maxWidth: 384,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(38,38,38,0.8)",
              backgroundColor: "rgba(23,23,23,0.9)",
              padding: 24,
            }}
          >
            {/* Security Shield Badge */}
            <View
              style={{
                alignSelf: "center",
                marginBottom: 16,
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "rgba(59,130,246,0.1)",
                borderWidth: 1,
                borderColor: "rgba(59,130,246,0.3)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={32} color="#60a5fa" strokeWidth={2.2} />
            </View>

            <TBold style={{ fontSize: 18, color: "#ffffff", textAlign: "center" }}>
              {isRTL ? "گاوصندوق دانش شخصی قفل شد" : "Personal Knowledge Vault Locked"}
            </TBold>
            <T style={{ marginTop: 8, fontSize: 12, color: "#a3a3a3", lineHeight: 18, textAlign: "center" }}>
              {isRTL
                ? "جهت حفاظت از یادداشت‌ها، پروژه‌ها و داده‌های حساس، پس از ۳۰ دقیقه عدم فعالیت به صورت خودکار قفل شد."
                : "Auto-locked after 30 minutes of inactivity to protect your sensitive knowledge assets."}
            </T>

            {/* PIN Dots Display */}
            <View style={{ marginTop: 24, marginBottom: 24, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14 }}>
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pinInput.length > index;
                return (
                  <View
                    key={index}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: isFilled ? "#3b82f6" : "#262626",
                      borderWidth: 1,
                      borderColor: isFilled ? "#60a5fa" : "rgba(64,64,64,0.8)",
                      transform: [{ scale: isFilled ? 1.1 : 1 }],
                    }}
                  />
                );
              })}
            </View>

            {/* Error message */}
            {errorMsg && (
              <View style={{ marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <AlertCircle size={14} color="#fb7185" />
                <T style={{ fontSize: 12, color: "#fb7185", fontWeight: "500" }}>{errorMsg}</T>
              </View>
            )}

            {/* Keypad Grid — 3x4 on-screen pad (no physical keyboard on mobile) */}
            <View style={{ alignSelf: "center", width: "100%", maxWidth: 280, gap: 10 }}>
              {KEYPAD_ROWS.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={{ flexDirection: "row", gap: 10 }}>
                  {row.map(renderKey)}
                </View>
              ))}
            </View>

            {/* Action Helpers: Clear / Default PIN & Quick Unlock */}
            <View style={{ marginTop: 24, gap: 8, borderTopWidth: 1, borderTopColor: "rgba(38,38,38,0.8)", paddingTop: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Clock size={12} color="#60a5fa" />
                  <T style={{ fontSize: 12, color: "#a3a3a3" }}>
                    {isRTL ? `زمان قفل: ${autoLockMinutes} دقیقه` : `Timeout: ${autoLockMinutes}m`}
                  </T>
                </View>

                <Pressable
                  onPress={handleQuickUnlock}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    borderRadius: 999,
                    backgroundColor: pressed ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(59,130,246,0.3)",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  })}
                >
                  <KeyRound size={12} color="#60a5fa" />
                  <T style={{ fontSize: 11, fontWeight: "600", color: "#60a5fa" }}>
                    {isRTL ? "بازگشایی سریع (۱۲۳۴)" : "Quick Unlock (1234)"}
                  </T>
                </Pressable>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <Pressable onPress={handleClear} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                  <T style={{ fontSize: 11, color: "#a3a3a3", textDecorationLine: "underline" }}>
                    {isRTL ? "پاک کردن" : "Clear"}
                  </T>
                </Pressable>
                <Pressable
                  onPress={() => setIsChangingPin(!isChangingPin)}
                  hitSlop={8}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <T style={{ fontSize: 11, color: "#a3a3a3", textDecorationLine: "underline" }}>
                    {isRTL ? "تنظیم یا تغییر رمز عبور اختصاصی" : "Set or change custom PIN"}
                  </T>
                </Pressable>
              </View>
            </View>

            {/* Change PIN dialog */}
            {isChangingPin && (
              <View style={{ marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: "#262626", backgroundColor: "rgba(10,10,10,1)", padding: 16, gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <KeyRound size={14} color="#60a5fa" />
                  <TBold style={{ fontSize: 12, color: "#ffffff" }}>
                    {isRTL ? "تغییر رمز عبور گاوصندوق" : "Change Vault PIN"}
                  </TBold>
                </View>

                {pinChangeSuccess ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} color="#60a5fa" />
                    <T style={{ fontSize: 12, color: "#60a5fa" }}>
                      {isRTL ? "رمز جدید با موفقیت ذخیره شد!" : "PIN changed successfully!"}
                    </T>
                  </View>
                ) : (
                  <>
                    <View>
                      <T style={{ fontSize: 10, color: "#a3a3a3", marginBottom: 4 }}>
                        {isRTL ? "رمز جدید (۴ رقم به بالا):" : "New PIN (4+ digits):"}
                      </T>
                      <Input
                        secureTextEntry
                        maxLength={8}
                        keyboardType="number-pad"
                        value={newPin}
                        onChangeText={(text) => setNewPin(text.replace(/[^0-9]/g, ""))}
                        placeholder="1234"
                        textAlign="left"
                        style={{
                          borderWidth: 1,
                          borderColor: "#262626",
                          backgroundColor: "#171717",
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          fontSize: 12,
                          color: "#ffffff",
                        }}
                      />
                    </View>

                    <View>
                      <T style={{ fontSize: 10, color: "#a3a3a3", marginBottom: 4 }}>
                        {isRTL ? "تکرار رمز جدید:" : "Confirm New PIN:"}
                      </T>
                      <Input
                        secureTextEntry
                        maxLength={8}
                        keyboardType="number-pad"
                        value={confirmPin}
                        onChangeText={(text) => setConfirmPin(text.replace(/[^0-9]/g, ""))}
                        placeholder="1234"
                        textAlign="left"
                        style={{
                          borderWidth: 1,
                          borderColor: "#262626",
                          backgroundColor: "#171717",
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          fontSize: 12,
                          color: "#ffffff",
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
                      <Pressable
                        onPress={() => setIsChangingPin(false)}
                        style={({ pressed }) => ({ borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, opacity: pressed ? 0.7 : 1 })}
                      >
                        <T style={{ fontSize: 12, color: "#a3a3a3" }}>{isRTL ? "انصراف" : "Cancel"}</T>
                      </Pressable>
                      <Pressable
                        onPress={handleChangePinSubmit}
                        style={({ pressed }) => ({
                          borderRadius: 8,
                          backgroundColor: pressed ? "#3b82f6" : "#2563eb",
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                        })}
                      >
                        <T style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>
                          {isRTL ? "ذخیره رمز" : "Save PIN"}
                        </T>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};
