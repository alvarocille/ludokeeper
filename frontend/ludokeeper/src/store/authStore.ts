import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loadToken: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isLoading: true,
  isAuthenticated: false,

  loadToken: async () => {
    console.log("[Auth] Ejecutando loadToken()");
    try {
      const storedToken = await AsyncStorage.getItem("token");
      console.log("[Auth] Token cargado:", storedToken);

      set({
        token: storedToken,
        isAuthenticated: !!storedToken,
        isLoading: false,
      });
    } catch (err) {
      console.error("[Auth] Error al cargar el token:", err);
      set({ isLoading: false });
    }
  },

  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
      const confirmed = await AsyncStorage.getItem("token");
      console.log("[Auth] Token guardado:", confirmed);

      set({
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.error("[Auth] Error al guardar el token:", err);
    }
  },

  logout: async () => {
    try {
      let confirmed = true;

      if (Platform.OS === "web") {
        confirmed = window.confirm("¿Seguro que quieres cerrar sesión?");
      } else {
        confirmed = await new Promise<boolean>((resolve) => {
          Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => resolve(false),
            },
            {
              text: "Cerrar sesión",
              style: "destructive",
              onPress: () => resolve(true),
            },
          ]);
        });
      }

      if (!confirmed) {
        console.log("[Auth] Logout cancelado por el usuario");
        return false;
      }

      console.log("[Auth] Ejecutando logout...");
      await AsyncStorage.removeItem("token");
      const check = await AsyncStorage.getItem("token");
      console.log("[Auth] Token tras logout:", check);

      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log("[Auth] Estado actualizado tras logout:", get());
      return true;
    } catch (err) {
      console.error("[Auth] Error al cerrar sesión:", err);
      return false;
    }
  },
}));
