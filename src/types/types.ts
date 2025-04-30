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
  skills: string[];
  languages: string[];
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string;
  is_verified: boolean;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  photos: TherapistPhotoData[];
  status: string | null;
  status_display: string | null;
}

export interface ClientProfileData {
  id: number;
  user_profile: number;
  request_details: string | null;
  interested_topics: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

export interface FullUserData extends BaseUserData {
  email: string;
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  created_at: string;
  updated_at: string;
  profile: UserProfileData;
  therapist_profile?: TherapistProfilePrivateData;
  client_profile?: ClientProfileData;
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

// Новые типы для фотографий и публикаций
export interface TherapistPhotoData {
  id: number;
  therapist_profile: number;
  image: string;
  caption: string;
  order: number;
}

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
  public_id: string;
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
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  photos: TherapistPhotoData[];
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
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  photos: TherapistPhotoData[];
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
  video_intro_url?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
}

// Новые типы для обновления сервисов
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
