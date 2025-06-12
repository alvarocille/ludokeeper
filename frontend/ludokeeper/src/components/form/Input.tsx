import { useAppTheme } from "src/styles/useAppTheme";
import { Control, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export default function Input({
  name,
  control,
  label,
  error,
  rightIcon,
  ...rest
}: InputProps) {
  const { colors, fonts } = useAppTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[styles.label, { color: colors.text, fontFamily: fonts.text }]}
        >
          {label}
        </Text>
      )}

      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name={name}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  fontFamily: fonts.text,
                },
                rightIcon && { paddingRight: 44 },
              ]}
              placeholderTextColor={colors.placeholder}
              onChangeText={onChange}
              value={value}
              {...rest}
            />
          )}
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {error && (
        <Text style={[styles.error, { fontFamily: fonts.text }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4 },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  error: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
