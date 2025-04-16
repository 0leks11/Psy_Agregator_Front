// Типы для пользователя и профиля
export interface UserProfileData {
  id: number;
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  gender: string;
  gender_code: "MALE" | "FEMALE" | "UNKNOWN";
  gender_display: string;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TherapistProfileData {
  id: number;
  user_profile: number;
  about: string;
  experience_years: number;
  skills: number[];
  languages: number[];
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string;
  is_verified: boolean;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
}



export interface ClientProfileData {
  id: number;
  user_profile: number;
  request_details: string;
  interested_topics: number[];
  created_at: string;
  updated_at: string;
}

export interface FullUserData extends BaseUserData {
  email: string;
  profile: UserProfileData | null;
  therapist_profile: TherapistProfileData | null;
  client_profile: ClientProfileData | null;
}

// Типы для навыков и языков
export interface SkillData {
  id: number;
  name: string;
  description?: string | null;
}

export interface LanguageData {
  id: number;
  name: string;
  code?: string | null;
}

// Опции для выбора пола
export const GENDER_OPTIONS: {
  value: UserProfileData["gender_code"];
  label: string;
}[] = [
  { value: "MALE", label: "Мужчина" },
  { value: "FEMALE", label: "Женщина" },
  { value: "UNKNOWN", label: "Не указан" },
];

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

export interface BaseUserData {
  id: number;
  first_name: string;
  last_name: string;
}

export interface TherapistProfileReadData {
  id: number;
  user: BaseUserData;
  profile: UserProfileData;
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
}

export interface ClientProfileReadData {
  id: number;
  user: BaseUserData;
  profile: UserProfileData;
  request_details: string | null;
  interested_topics: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

export interface TherapistPublicData {
  id: number;
  user: BaseUserData;
  profile: UserProfileData;
  about: string | null;
  experience_years: number;
  skills: string[];
  languages: string[];
  total_hours_worked: number | null;
  office_location: string | null;
  is_verified: boolean;
  is_subscribed: boolean;
}

export interface AuthResponse {
  token: string;
  user: FullUserData;
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

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  gender?: string;
  profile_picture?: File;
  about?: string;
  experience_years?: number;
  skills?: number[];
  languages?: number[];
  total_hours_worked?: number | null;
  display_hours?: boolean;
  office_location?: string;
  request_details?: string;
  interested_topics?: number[];
}
