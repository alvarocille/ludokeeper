import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { login } from "src/api/auth";
import FormButton from "src/components/form/FormButton";
import { FormContainer } from "src/components/form/FormContainer";
import Input from "src/components/form/Input";
import { useAppTheme } from "src/styles/useAppTheme";
import { useAuthForm } from "src/hooks/useAuthForm";
import { useAuthStore } from "src/store/authStore";
import { useAuthStyles } from "src/styles/authStyles";
import { loginSchema } from "src/validations/login";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useAuthStyles();
  const setToken = useAuthStore((state) => state.setToken);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    serverError,
    handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useAuthForm(loginSchema, async (data) => {
    const res = await login(data.username, data.password);
    await setToken(res.access_token, res.refresh_token);
    router.replace("/(root)/inventory");
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.settingsButton}
        onPress={() => router.push("/(other)/settings")}
      >
        <Ionicons name="settings-outline" size={24} color={colors.text} />
      </Pressable>

      <Text style={styles.title}>LUDOKEEPER</Text>
      {serverError && <Text style={styles.errorText}>{serverError}</Text>}

      <FormContainer schema={loginSchema} onSubmit={() => {}}>
        <Input
          name="username"
          control={control}
          placeholder="Nombre de usuario"
          autoCapitalize="none"
          error={errors.username?.message}
        />
        <Input
          name="password"
          control={control}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          error={errors.password?.message}
          rightIcon={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.text}
              />
            </Pressable>
          }
        />
        <FormButton
          title="Entrar"
          isLoading={isSubmitting}
          onPress={handleFormSubmit}
        />
      </FormContainer>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
}
