import { useColorScheme } from "react-native";
import { useThemeStore } from "src/store/themeStore";
import { darkTheme, lightTheme } from "src/styles/theme";

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const { themeMode } = useThemeStore();

  const resolvedTheme =
    themeMode === "system" ? systemScheme : themeMode;

  return resolvedTheme === "dark" ? darkTheme : lightTheme;
};
