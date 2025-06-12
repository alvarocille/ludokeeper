import { AUTH_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert, Platform } from "react-native";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loadToken: () => Promise<void>;
  setToken: (token: string, refreshToken: string) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<boolean>;
}

let refreshInterval: number | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,

  loadToken: async () => {
    console.log("[Auth] Ejecutando loadToken()");
    try {
      const token = await AsyncStorage.getItem("token");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!token || !refreshToken || refreshToken.length < 20) {
        console.warn("[Auth] No se encontró un refreshToken válido");
        set({ isLoading: false });
        return;
      }

      set({
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log("[Auth] Tokens cargados desde AsyncStorage");

      // Lanza refresco automático tras cargar sesión
      if (refreshInterval) clearInterval(refreshInterval);
      refreshInterval = setInterval(
        () => {
          console.log("[Auth] ⏰ Refrescando token por intervalo...");
          get().refreshSession();
        },
        4 * 60 * 1000,
      ); // cada 4 minutos
    } catch (err) {
      console.error("[Auth] Error en loadToken:", err);
      set({ isLoading: false });
    }
  },

  setToken: async (token: string, refreshToken: string) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      set({
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Activa el temporizador de refresh
      if (refreshInterval) clearInterval(refreshInterval);
      refreshInterval = setInterval(
        () => {
          console.log("[Auth] ⏰ Refrescando token por intervalo...");
          get().refreshSession();
        },
        4 * 60 * 1000,
      ); // cada 4 minutos
    } catch (err) {
      console.error("[Auth] Error al guardar tokens:", err);
    }
  },

  refreshSession: async () => {
    try {
      const refreshToken =
        get().refreshToken || (await AsyncStorage.getItem("refreshToken"));
      if (!refreshToken || refreshToken.length < 20)
        throw new Error("No refresh token válido disponible");

      console.log("[Auth] Solicitando nuevo token con refresh_token...");

      const res = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = res.data;

      await AsyncStorage.setItem("token", access_token);
      await AsyncStorage.setItem("refreshToken", refresh_token);

      set({
        token: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log("[Auth] ✅ Token refrescado correctamente");
      return true;
    } catch (err) {
      console.error("[Auth] ❌ Error al refrescar token:", err);
      await get().logout();
      return false;
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
      await AsyncStorage.multiRemove(["token", "refreshToken"]);

      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }

      set({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return true;
    } catch (err) {
      console.error("[Auth] Error al cerrar sesión:", err);
      return false;
    }
  },
}));
