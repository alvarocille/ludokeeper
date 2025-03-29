import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loadToken: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isLoading: true,
  isAuthenticated: false,

  loadToken: async () => {
    const current = get().token;
    if (current) return;

    const storedToken = await AsyncStorage.getItem("token");
    set({
      token: storedToken,
      isAuthenticated: !!storedToken,
      isLoading: false,
    });
  },

  setToken: async (token: string) => {
    await AsyncStorage.setItem("token", token);
    set({
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
