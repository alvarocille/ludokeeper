import { useAppTheme } from "src/styles/useAppTheme";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

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
  const { colors, fonts } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.primary, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: colors.text, fontFamily: fonts.textBold },
          ]}
        >
          {title}
        </Text>
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
  },
});
