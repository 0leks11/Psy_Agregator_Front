import { FullUserData } from "./user";

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Типы для ошибок
export interface ApiError {
  message: string;
  status: number;
  data?: Record<string, string[]>;
}

// Типы для API эндпоинтов
export interface ApiEndpoints {
  auth: {
    login: string;
    logout: string;
    user: string;
  };
  profile: {
    base: string;
    therapist: string;
    client: string;
    picture: string;
  };
  therapists: {
    list: string;
    detail: (id: number) => string;
  };
  skills: string;
  languages: string;
}

// Типы для контекста аутентификации
export interface AuthContextType {
  user: FullUserData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserState: (userData: FullUserData) => void;
}

// Типы для защищенных маршрутов
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "CLIENT" | "THERAPIST";
}
