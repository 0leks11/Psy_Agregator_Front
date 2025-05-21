import axios from "axios";

// Вспомогательная функция для получения значения куки по имени
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true, // Критически важно для работы с куками
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Добавляем CSRF токен к запросам
api.interceptors.request.use((config) => {
  // Добавляем CSRF токен только для "небезопасных" методов
  if (
    ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() || ""
    )
  ) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      // Django ожидает заголовок X-CSRFToken
      config.headers["X-CSRFToken"] = csrfToken;
    } else {
      console.warn("CSRF token not found in cookies");
    }
  }
  return config;
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const errorDetail = error.response?.data?.detail;
      if (errorDetail === "CSRF Failed: CSRF token missing or incorrect.") {
        console.error("CSRF token missing or incorrect");
        // Можно добавить логику для обновления страницы или показа уведомления
        // window.location.reload(); // Например, перезагрузить страницу
      }
    }
    return Promise.reject(error);
  }
);

// Добавляем интерцептор для токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
