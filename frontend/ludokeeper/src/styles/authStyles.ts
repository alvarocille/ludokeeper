import { StyleSheet } from "react-native";
import { fonts } from "./fonts";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.heading,
    marginBottom: 32,
    textAlign: "center",
  },
  titleSmall: {
    fontSize: 28,
    fontFamily: fonts.heading,
    marginBottom: 32,
    textAlign: "center",
  },
  linkText: {
    textAlign: "center",
    marginTop: 16,
    fontFamily: fonts.text,
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
