import { Logo } from "src/components/logo/Logo";
import { useAppTheme } from "src/styles/useAppTheme";

export const LogoDynamic = () => {
  const theme = useAppTheme();
  const { text, background } = theme.colors;

  return (
    <Logo
      primaryColor={text}
      secondaryColor={background}
      aspectRatio={260}
    />
  );
};
