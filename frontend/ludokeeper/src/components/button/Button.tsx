import { useAppTheme } from "src/styles/useAppTheme";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: Props) {
  const { colors } = useAppTheme();

  const backgroundColor =
    variant === "secondary" ? colors.secondary : colors.primary;

  const textColor =
    variant === "secondary" ? colors.background : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          opacity: pressed || disabled ? 0.7 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
