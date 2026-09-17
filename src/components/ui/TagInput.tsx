import React, { useState, useMemo } from "react";
import { View, Pressable, ScrollView, TextInput } from "react-native";
import { Hash, X, Plus, Tag as TagIcon } from "lucide-react-native";
import { T } from "./primitives";

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  allAvailableTags?: string[];
  placeholder?: string;
  maxTags?: number;
  isRTL?: boolean;
  allowCreate?: boolean;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  allAvailableTags = [],
  placeholder,
  maxTags = 25,
  isRTL = false,
  allowCreate = true,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const cleanInput = inputValue.trim().replace(/^#+/, "");

  // Compute filtered suggestions
  const suggestions = useMemo(() => {
    const currentTagsLower = new Set(tags.map((t) => t.toLowerCase().trim()));

    const available = allAvailableTags
      .map((t) => t.trim().replace(/^#+/, ""))
      .filter((t) => t.length > 0 && !currentTagsLower.has(t.toLowerCase()));

    if (!cleanInput) {
      return available.slice(0, 8);
    }

    const lower = cleanInput.toLowerCase();

    const prefixMatches: string[] = [];
    const substringMatches: string[] = [];

    for (const tag of available) {
      const tagLower = tag.toLowerCase();
      if (tagLower === lower) {
        prefixMatches.unshift(tag);
      } else if (tagLower.startsWith(lower)) {
        prefixMatches.push(tag);
      } else if (tagLower.includes(lower)) {
        substringMatches.push(tag);
      }
    }

    return [...prefixMatches, ...substringMatches].slice(0, 10);
  }, [allAvailableTags, tags, cleanInput]);

  const isExactMatchInSuggestions = suggestions.some(
    (s) => s.toLowerCase() === cleanInput.toLowerCase()
  );
  const isAlreadyAdded = tags.some(
    (t) => t.toLowerCase().trim() === cleanInput.toLowerCase()
  );
  const canCreateNew =
    allowCreate &&
    cleanInput.length > 0 &&
    !isExactMatchInSuggestions &&
    !isAlreadyAdded &&
    tags.length < maxTags;

  const handleAddTag = (rawTag: string) => {
    const clean = rawTag.trim().replace(/^#+/, "");
    if (!clean) return;

    if (tags.length >= maxTags) return;

    // Check if duplicate (case-insensitive)
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setInputValue("");
      setIsOpen(false);
      return;
    }

    onChange([...tags, clean]);
    setInputValue("");
    setIsOpen(false);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    if (disabled) return;
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const renderHighlighted = (text: string, query: string) => {
    if (!query) return `#${text}`;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) return `#${text}`;

    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length);

    // Compose highlighted preview as plain string (RN nested Text handled by caller)
    return `#${before}${match}${after}`;
  };

  const defaultPlaceholder = isRTL
    ? "افزودن برچسب... (مثلاً: #ایده، کار)"
    : "Add tag... (e.g. #ideas, task)";

  const totalItems = suggestions.length + (canCreateNew ? 1 : 0);

  return (
    <View style={{ width: "100%" }}>
      {/* Tags Wrapper Box */}
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          minHeight: 42,
          width: "100%",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: isOpen ? "rgba(59,130,246,0.7)" : "#262626",
          backgroundColor: "rgba(23,23,23,0.9)",
          paddingHorizontal: 12,
          paddingVertical: 8,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Selected Tags Chips */}
        {tags.map((tag, idx) => (
          <View
            key={`${tag}-${idx}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              borderRadius: 12,
              backgroundColor: "rgba(23,37,84,0.6)",
              borderWidth: 1,
              borderColor: "rgba(30,64,175,0.6)",
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Hash size={12} color="#60a5fa" />
            <T numberOfLines={1} style={{ fontSize: 12, fontWeight: "600", color: "#bfdbfe", maxWidth: 150 }}>
              {tag}
            </T>
            {!disabled ? (
              <Pressable
                onPress={() => handleRemoveTag(idx)}
                style={{ padding: 1 }}
              >
                <X size={12} color="#60a5fa" />
              </Pressable>
            ) : null}
          </View>
        ))}

        {/* Input Field */}
        {tags.length < maxTags && !disabled ? (
          <View style={{ flex: 1, minWidth: 120 }}>
            <TextInput
              value={inputValue}
              onChangeText={(v) => {
                setInputValue(v);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onSubmitEditing={() => {
                if (cleanInput) handleAddTag(cleanInput);
              }}
              placeholder={
                tags.length === 0
                  ? placeholder || defaultPlaceholder
                  : placeholder || (isRTL ? "+ برچسب..." : "+ tag...")
              }
              placeholderTextColor="#737373"
              style={{
                flex: 1,
                padding: 4,
                fontSize: 12,
                color: "#ffffff",
                textAlign: isRTL ? "right" : "left",
              }}
            />
          </View>
        ) : null}
      </Pressable>

      {/* Auto-Complete Suggestion Popup List */}
      {isOpen && !disabled && (totalItems > 0 || cleanInput) ? (
        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#262626",
            backgroundColor: "#0a0a0a",
            padding: 6,
            marginTop: 6,
            maxHeight: 224,
          }}
        >
          <ScrollView style={{ maxHeight: 210 }} nestedScrollEnabled>
            {/* Matching Suggestions from Workspace */}
            {suggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => handleAddTag(suggestion)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: pressed ? "#262626" : "transparent",
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <TagIcon size={14} color="#60a5fa" />
                  <T numberOfLines={1} style={{ fontSize: 12, color: "#e5e5e5", flex: 1 }}>
                    {renderHighlighted(suggestion, cleanInput)}
                  </T>
                </View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                    backgroundColor: "#171717",
                    borderWidth: 1,
                    borderColor: "#262626",
                  }}
                >
                  <T style={{ fontSize: 10, color: "#a3a3a3" }}>
                    {isRTL ? "موجود" : "existing"}
                  </T>
                </View>
              </Pressable>
            ))}

            {/* Create New Custom Tag Option */}
            {canCreateNew ? (
              <Pressable
                onPress={() => handleAddTag(cleanInput)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderTopWidth: 1,
                  borderTopColor: "#262626",
                  backgroundColor: pressed ? "rgba(5,150,105,0.2)" : "transparent",
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <Plus size={14} color="#34d399" />
                  <T numberOfLines={1} style={{ fontSize: 12, color: "#34d399", flex: 1 }}>
                    {isRTL ? `ایجاد برچسب جدید: #${cleanInput}` : `Create tag: #${cleanInput}`}
                  </T>
                </View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                    backgroundColor: "rgba(6,78,59,0.6)",
                    borderWidth: 1,
                    borderColor: "rgba(6,95,70,0.6)",
                  }}
                >
                  <T style={{ fontSize: 10, color: "#6ee7b7" }}>{isRTL ? "جدید" : "new"}</T>
                </View>
              </Pressable>
            ) : null}

            {/* Empty matching fallback */}
            {suggestions.length === 0 && !canCreateNew && cleanInput ? (
              <T style={{ paddingHorizontal: 12, paddingVertical: 12, textAlign: "center", fontSize: 12, color: "#737373" }}>
                {isAlreadyAdded
                  ? isRTL ? "این برچسب قبلاً افزوده شده است" : "Tag already added"
                  : isRTL ? "هیچ برچسبی یافت نشد" : "No matching tags"}
              </T>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};
