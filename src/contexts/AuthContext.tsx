import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import api from "../services/api"; // Your configured axios instance
import { loginUser, registerUser } from "../services/authService";
import { getMyProfile } from "../services/profileService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FullUserData } from "../types/user";

interface AuthContextType {
  user: FullUserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: "CLIENT" | "THERAPIST";
    invite_code?: string;
  }) => Promise<boolean>;
  updateUserState: (userData: FullUserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const data = await loginUser({ email, password });
      if (data && data.token && data.user) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
        setUser(data.user);
        console.log("AuthProvider: Успешный вход", data.user);
      }
    } catch (error) {
      console.error("AuthProvider: Ошибка входа", error);
      setError("Ошибка входа");
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
    role: "CLIENT" | "THERAPIST";
    invite_code?: string;
  }): Promise<boolean> => {
    try {
      const data = await registerUser(userData);
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

// Custom Hook to use Auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
