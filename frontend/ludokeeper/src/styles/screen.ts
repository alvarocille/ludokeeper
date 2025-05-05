import { StyleSheet } from "react-native";
import { fonts } from "src/styles/fonts";

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.heading,
    textAlign: "center",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  itemText: {
    fontFamily: fonts.text,
    fontSize: 16,
  },
  icon: {
    width: 24,
    textAlign: "center",
  },
});
