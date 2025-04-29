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

// Новые типы для публичного API
export interface SimplePublication {
  id: string; // UUID
  title?: string | null;
  content?: string | null;
  created_at: string;
  // content_snippet?: string; // Если добавили на бэке
}

export interface PublicProfileData {
  public_id: string;
  first_name: string;
  last_name: string;
  pronouns: string | null;
  profile_picture_url: string | null;
  about: string | null;
  skills: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  short_video_url: string | null;
  status: string | null;
  status_display: string | null;
  publications: SimplePublication[];
  photos: string[];
  experience_years: number;
  is_verified: boolean;
  is_subscribed: boolean;
}

export interface ApiTherapistListData {
  id: number;
  public_id: string;
  first_name: string;
  last_name: string;
  profile: {
    profile_picture_url: string | null;
    gender: string;
    gender_display: string;
    pronouns: string | null;
  };
  therapist_profile: {
    about: string | null;
    experience_years: number;
    is_verified: boolean;
    is_subscribed: boolean;
    skills: Array<{ id: number; name: string }>;
    languages: Array<{ id: number; name: string }>;
    status: string | null;
    status_display: string | null;
    video_intro_url: string | null;
    website_url: string | null;
    linkedin_url: string | null;
    photos: Array<{
      id: number;
      image: string;
      caption: string;
      order: number;
    }>;
  };
}
