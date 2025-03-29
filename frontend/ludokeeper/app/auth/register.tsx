import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { register } from "src/api/auth";
import FormButton from "src/components/form/FormButton";
import { FormContainer } from "src/components/form/FormContainer";
import Input from "src/components/form/Input";
import { useAuthForm } from "src/hooks/useAuthForm";
import { authStyles } from "src/styles/authStyles";
import { colors } from "src/styles/colors";
import { RegisterData, registerSchema } from "src/validations/register";

export default function RegisterScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    serverError,
    handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useAuthForm<RegisterData>(registerSchema, async (data) => {
    const cleanData = data as Required<RegisterData>;
    await register(cleanData);
    router.replace("/");
  });

  return (
    <View style={[authStyles.container, { backgroundColor: theme.background }]}>
      <Pressable
        style={authStyles.settingsButton}
        onPress={() => router.back()}
      >
        <Ionicons name="settings-outline" size={24} color={theme.text} />
      </Pressable>

      <Text style={[authStyles.titleSmall, { color: theme.text }]}>
        Registro
      </Text>
      {serverError && <Text style={authStyles.errorText}>{serverError}</Text>}

      <FormContainer schema={registerSchema} onSubmit={() => {}}>
        <Input
          name="username"
          control={control}
          placeholder="Nombre de usuario"
          autoCapitalize="none"
          error={errors.username?.message}
        />
        <Input
          name="firstName"
          control={control}
          placeholder="Nombre"
          error={errors.firstName?.message}
        />
        <Input
          name="lastName"
          control={control}
          placeholder="Apellido"
          error={errors.lastName?.message}
        />
        <Input
          name="email"
          control={control}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email?.message}
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
          title="Registrarse"
          isLoading={isSubmitting}
          onPress={handleFormSubmit}
        />
      </FormContainer>

      <Pressable onPress={() => router.replace("/")}>
        {" "}
        <Text style={[authStyles.linkText, { color: theme.secondary }]}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </Pressable>
    </View>
  );
}
