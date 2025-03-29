import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { login } from "src/api/auth";
import FormButton from "src/components/form/FormButton";
import { FormContainer } from "src/components/form/FormContainer";
import Input from "src/components/form/Input";
import { useAuthForm } from "src/hooks/useAuthForm";
import { useAuthStore } from "src/store/authStore";
import { authStyles } from "src/styles/authStyles";
import { colors } from "src/styles/colors";
import { loginSchema } from "src/validations/login";

export default function LoginScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;
  const setToken = useAuthStore((state) => state.setToken);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    serverError,
    handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useAuthForm(loginSchema, async (data) => {
    const res = await login(data.username, data.password);
    await setToken(res.access_token);
    router.replace("/");
  });

  return (
    <View style={[authStyles.container, { backgroundColor: theme.background }]}>
      <Pressable
        style={authStyles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-outline" size={24} color={theme.text} />
      </Pressable>

      <Text style={[authStyles.title, { color: theme.text }]}>LUDOKEEPER</Text>
      {serverError && <Text style={authStyles.errorText}>{serverError}</Text>}

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
                color={theme.text}
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

      <Pressable onPress={() => router.push("/auth/register")}>
        <Text style={[authStyles.linkText, { color: theme.secondary }]}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </Pressable>
    </View>
  );
}
