import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Antes de cada pedido, acrescenta o token (se existir)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tasknova_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o servidor responder 401 (token inválido ou expirado), termina a sessão
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.startsWith("/auth/login") ||
      error.config?.url?.startsWith("/auth/register");
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("tasknova_token");
      localStorage.removeItem("tasknova_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
