import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем интерцептор для токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Интерцептор ответа для обработки 401 ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401. Clearing token.");
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export default api;
