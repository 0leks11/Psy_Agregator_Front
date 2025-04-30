import { BaseUserData, TherapistPhotoData } from "./models"; // Добавляем TherapistPhotoData

// Удаляем дубликаты UserProfileData, TherapistProfileData, ClientProfileData, FullUserData, SkillData
// Оставляем только специфичные для types.ts типы, если они есть,
// и те, что связаны с API и компонентами (Error, Loading, AuthContext, ProtectedRoute)

// Новые типы для фотографий и публикаций (Перенести в models.ts?)
export interface PublicationData {
  id: number;
  author: number | BaseUserData;
  title: string;
  content: string;
  featured_image: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Опции для выбора пола УДАЛЕНЫ, так как есть в user.ts

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

// Типы для компонентов
export interface ErrorMessageProps {
  message: string;
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

// Типы для контекста аутентификации
// Перенести AuthContextType в contexts/AuthContext.tsx или отдельный types/auth.ts?
export interface AuthContextType {
  user: import("./models").FullUserData | null; // Используем тип из models
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserState: (userData: import("./models").FullUserData) => void;
}

// Типы для защищенных маршрутов
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "CLIENT" | "THERAPIST";
}

// Типы для чтения данных (перенести в models?)
export interface TherapistProfileReadData {
  id: number;
  user: BaseUserData;
  profile: import("./models").UserProfileData; // Используем тип из models
  about: string | null;
  experience_years: number;
  is_verified: boolean;
  is_subscribed: boolean;
  skills: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  total_hours_worked: number | null;
  office_location: string | null;
  created_at: string;
  updated_at: string;
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  photos: TherapistPhotoData[];
}

export interface ClientProfileReadData {
  id: number;
  user: BaseUserData;
  profile: import("./models").UserProfileData; // Используем тип из models
  request_details: string | null;
  interested_topics: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

// Типы для публичных данных терапевта
export interface TherapistPublicData {
  id: number;
  user: BaseUserData;
  profile: import("./models").UserProfileData; // Используем тип из models
  about: string | null;
  experience_years: number;
  skills: string[];
  languages: string[];
  total_hours_worked: number | null;
  office_location: string | null;
  is_verified: boolean;
  is_subscribed: boolean;
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  photos: TherapistPhotoData[];
}

// Типы для аутентификации
export interface AuthResponse {
  token: string;
  user: import("./models").FullUserData; // Используем тип из models
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "CLIENT" | "THERAPIST";
  invite_code?: string;
}

// Типы для обновления данных (перенести в models?)
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  gender?: string; // Здесь может быть string, а на бэке преобразуется
  profile_picture?: File;
  about?: string;
  experience_years?: number;
  skills?: number[]; // ID
  languages?: number[]; // ID
  total_hours_worked?: number | null;
  display_hours?: boolean;
  office_location?: string;
  request_details?: string;
  interested_topics?: number[]; // ID
  video_intro_url?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
}

export interface TherapistProfileUpdateData {
  about?: string;
  experience_years?: number;
  skills?: number[];
  languages?: number[];
  total_hours_worked?: number | null;
  display_hours?: boolean;
  office_location?: string;
  video_intro_url?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
}

export interface ClientProfileUpdateData {
  request_details?: string;
  interested_topics?: number[];
}

export interface TherapistPhotoUploadData {
  image: File;
  caption?: string;
  order?: number;
}

export interface PublicationCreateUpdateData {
  title: string;
  content: string;
  featured_image?: File | null;
  is_published?: boolean;
}
