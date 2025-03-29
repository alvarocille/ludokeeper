import { Control, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";
import { colors } from "../../styles/colors";
import { fonts } from "../../styles/fonts";

interface InputProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode; // 👈 nuevo
}

export default function Input({
  name,
  control,
  label,
  error,
  rightIcon,
  ...rest
}: InputProps) {
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}

      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name={name}
          defaultValue={""}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text },
                rightIcon && { paddingRight: 44 }, // espacio para el icono
              ]}
              placeholderTextColor={theme.placeholder}
              onChangeText={onChange}
              value={value}
              {...rest}
            />
          )}
        />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, fontFamily: fonts.text, marginBottom: 4 },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: fonts.text,
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
    fontFamily: fonts.text,
  },
});
