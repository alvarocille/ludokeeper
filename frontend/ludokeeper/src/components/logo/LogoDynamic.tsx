import { useColorScheme } from "react-native";
import { Logo } from "src/components/logo/Logo";
import { colors } from "src/styles/colors";

export const LogoDynamic = () => {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const { text, background } = colors[theme];

  return (
    <Logo primaryColor={text} secondaryColor={background} aspectRatio={600} />
  );
};
