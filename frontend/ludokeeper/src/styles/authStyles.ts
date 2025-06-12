import { StyleSheet } from "react-native";
import { useAppTheme } from "./useAppTheme";

export const useAuthStyles = () => {
  const { colors, fonts } = useAppTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 32,
      fontFamily: fonts.heading,
      marginBottom: 32,
      textAlign: "center",
      color: colors.text,
    },
    titleSmall: {
      fontSize: 28,
      fontFamily: fonts.heading,
      marginBottom: 32,
      textAlign: "center",
      color: colors.text,
    },
    linkText: {
      textAlign: "center",
      marginTop: 16,
      fontFamily: fonts.text,
      color: colors.secondary,
    },
    errorText: {
      color: "red",
      fontSize: 13,
      marginBottom: 8,
      marginLeft: 4,
      fontFamily: fonts.text,
    },
    settingsButton: {
      position: "absolute",
      top: 40,
      right: 20,
      zIndex: 10,
    },
  });
};
