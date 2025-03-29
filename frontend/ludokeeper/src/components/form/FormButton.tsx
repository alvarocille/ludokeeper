import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { colors } from "../../styles/colors";
import { fonts } from "../../styles/fonts";

interface FormButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function FormButton({
  onPress,
  title,
  isLoading,
  disabled,
}: FormButtonProps) {
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.primary, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.textBold,
  },
});
