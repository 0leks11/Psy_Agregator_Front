// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useContext,
} from "react";
import { AxiosError } from "axios";
// УБИРАЕМ: import { useLocation, useNavigate } from "react-router-dom";
import {
  loginUser as apiLoginUser,
  registerClient as apiRegisterClient,
  registerTherapist as apiRegisterTherapist,
  logoutUser as apiLogoutUser,
} from "../services/authService";
import { getMyProfile } from "../services/profileService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FullUserData, UserRegistrationData } from "../types/models";

// Определяем тип для AuthContext (БЕЗ полей сайдбара)
export interface AuthContextType {
  user: FullUserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>; // Просто очищает состояние и делает API вызов
  register: (userData: UserRegistrationData) => Promise<boolean>; // Уточнили тип userData
  updateUserState: (userData: FullUserData) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FullUserData | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // УБИРАЕМ: const location = useLocation();
  // УБИРАЕМ: const navigate = useNavigate();
  // УБИРАЕМ: Всю логику и состояния для isSidebarExpanded, isChatPanelOpen и т.д.

  const fetchUser = useCallback(async () => {
    console.log("AuthProvider: Загрузка профиля пользователя...");
    const currentToken = localStorage.getItem("authToken");
    if (currentToken && !token) {
      setToken(currentToken);
    }
    if (currentToken) {
      try {
        const userData = await getMyProfile();
        if (userData) {
          setUser(userData);
          console.log("AuthProvider: Профиль пользователя загружен", userData);
        } else {
          localStorage.removeItem("authToken");
          setUser(null);
          setToken(null);
        }
      } catch (error: unknown) {
        console.error("AuthProvider: Ошибка при загрузке профиля", error);
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUserState = useCallback((newUserData: FullUserData) => {
    setUser(newUserData);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const data = await apiLoginUser({ email, password });
      if (data && data.token && data.user) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      setAuthError("Неверные данные ответа от сервера при входе.");
      return false;
    } catch (error: unknown) {
      let message = "Ошибка входа.";
      if (error instanceof AxiosError) {
        message = error.response?.data?.detail || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setAuthError(message);
      return false;
    }
  };

  const logout = async () => {
    console.log(
      "AuthProvider: Выполнение выхода (только очистка состояния и API)..."
    );
    try {
      await apiLogoutUser();
    } catch (error: unknown) {
      console.error("AuthProvider: Ошибка при вызове API логаута", error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setToken(null);
      setAuthError(null);
      // НЕ ДЕЛАЕМ navigate ЗДЕСЬ
    }
  };

  const register = async (userData: UserRegistrationData): Promise<boolean> => {
    // ... (ваша логика регистрации без navigate)
    // Возвращайте true при успехе, чтобы компонент формы мог сделать navigate
    setAuthError(null);
    try {
      let data;
      if (userData.role === "THERAPIST") {
        data = await apiRegisterTherapist(userData);
      } else {
        data = await apiRegisterClient(userData);
      }
      if (data && data.user) {
        // Успешная регистрация (токен может быть или не быть)
        console.log(
          "AuthProvider: Успешная регистрация (пользователь создан)",
          data.user
        );
        // Если API возвращает токен при регистрации и вы хотите авто-логин:
        // if (data.token) {
        //   localStorage.setItem("authToken", data.token);
        //   setToken(data.token);
        //   setUser(data.user);
        // }
        return true;
      }
      setAuthError("Не удалось завершить регистрацию.");
      return false;
    } catch (error: unknown) {
      let message = "Ошибка регистрации.";
      if (error instanceof AxiosError) {
        message = error.response?.data?.detail || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setAuthError(message);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    error: authError,
    login,
    logout,
    register,
    updateUserState,
    // УБИРАЕМ: isSidebarExpanded, toggleSidebar, isChatPanelOpen, toggleChatPanel, openChatWithUser
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
