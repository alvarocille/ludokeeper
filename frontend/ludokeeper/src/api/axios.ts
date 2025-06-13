import axios from "axios";
import { useAuthStore } from "src/store/authStore";

const api = axios.create();

// Interceptor de petición: añade token
api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: maneja 401 y refresca token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshed = await useAuthStore.getState().refreshSession();

      if (refreshed) {
        const { token } = useAuthStore.getState();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } else {
        await useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;