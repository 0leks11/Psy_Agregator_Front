import { TherapistPhotoData } from "./models";

// Типы для пользователя и профиля
export interface UserProfileData {
  id: number;
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  gender: string;
  gender_code: "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
  gender_display: string;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TherapistProfileData {
  id: number;
  user_profile: number;
  about: string | null;
  experience_years: number;
  skills: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string | null;
  is_verified: boolean;
  is_subscribed: boolean;
  photos: TherapistPhotoData[];
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
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

export interface BaseUserData {
  id: number;
  public_id: string;
  first_name: string;
  last_name: string;
}

export interface FullUserData extends BaseUserData {
  email: string;
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  created_at: string;
  updated_at: string;
  profile: UserProfileData;
  therapist_profile?: TherapistProfileData;
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

// Опции для выбора пола
export const GENDER_OPTIONS = [
  { code: "MALE", display: "Мужской" },
  { code: "FEMALE", display: "Женский" },
  { code: "UNKNOWN", display: "Не указано" },
] as const;

export interface User {
  id: number;
  public_id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: {
    role: "CLIENT" | "THERAPIST" | "ADMIN";
    // ... остальные поля
  };
  // ... остальные поля
}

export interface TherapistProfileReadData {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  profile: {
    role: "CLIENT" | "THERAPIST" | "ADMIN";
    gender: string;
    profile_picture_url: string | null;
  };
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

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  gender?: string;
}

export interface TherapistProfileUpdateData {
  about?: string;
  experience_years?: number;
  skills?: number[];
  languages?: number[];
  total_hours_worked?: number | null;
  display_hours?: boolean;
  office_location?: string;
}

export interface ClientProfileUpdateData {
  request_details?: string;
  interested_topics?: number[];
}
