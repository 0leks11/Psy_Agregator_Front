import React, { useState, useEffect, useCallback, ReactNode } from "react";
import {
  loginUser,
  registerClient,
  registerTherapist,
} from "../services/authService";
import { getMyProfile } from "../services/profileService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FullUserData } from "../types/models";
import { AuthContext, AuthContextType } from "./authContextDefinition";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FullUserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    console.log("AuthProvider: Загрузка профиля пользователя...");
    const currentToken = localStorage.getItem("authToken");
    if (currentToken) {
      try {
        const userData = await getMyProfile();
        if (userData) {
          setUser(userData);
          console.log("AuthProvider: Профиль пользователя загружен", userData);
        } else {
          console.error(
            "AuthProvider: Не удалось получить данные пользователя"
          );
          localStorage.removeItem("authToken");
          setUser(null);
          setToken(null);
        }
      } catch (error) {
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUserState = (userData: FullUserData) => {
    console.log("AuthProvider: Обновление состояния пользователя", userData);
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser({ email, password });
      if (data && data.token && data.user) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);
        console.log("AuthProvider: Успешный вход", data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("AuthProvider: Ошибка входа", error);
      setError("Ошибка входа");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
  };

  const register = async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: "CLIENT" | "THERAPIST" | "ADMIN";
    invite_code?: string;
  }): Promise<boolean> => {
    try {
      let data;
      if (userData.role === "THERAPIST") {
        if (!userData.invite_code) {
          throw new Error("Invite code is required for therapist registration");
        }
        data = await registerTherapist(userData);
      } else if (userData.role === "CLIENT") {
        data = await registerClient(userData);
      } else {
        console.error(
          "AuthProvider: Регистрация для роли ADMIN не поддерживается."
        );
        return false;
      }

      if (data && data.token && data.user) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);
        console.log("AuthProvider: Успешная регистрация", data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("AuthProvider: Ошибка регистрации", error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    register,
    updateUserState,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
