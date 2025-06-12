import { StyleSheet } from "react-native";
import { useAppTheme } from "./useAppTheme";

export function useScreenStyles() {
  const { colors, fonts } = useAppTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      gap: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontFamily: fonts.heading,
      textAlign: "center",
      marginBottom: 16,
      color: colors.text,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 16,
      backgroundColor: `${colors.text}0D`,
    },
    itemText: {
      fontFamily: fonts.text,
      fontSize: 16,
      color: colors.text,
    },
    icon: {
      width: 24,
      textAlign: "center",
    },
    loadingText: {
      textAlign: "center",
      fontFamily: fonts.text,
      fontSize: 14,
      color: colors.placeholder,
    },
    errorText: {
      textAlign: "center",
      fontFamily: fonts.text,
      fontSize: 14,
      color: "red",
    },
    emptyText: {
      textAlign: "center",
      fontFamily: fonts.text,
      fontSize: 14,
      color: colors.placeholder,
    },
  });
}
