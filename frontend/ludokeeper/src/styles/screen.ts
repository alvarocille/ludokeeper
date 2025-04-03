import { StyleSheet } from "react-native";
import { fonts } from "./fonts";

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.heading,
    textAlign: "center",
  },
});
