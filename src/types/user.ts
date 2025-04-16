// Типы для пользователя и профиля
export interface UserProfileData {
  id: number;
  user: number;
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  gender_code: "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
  gender: string;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TherapistProfileData {
  id: number;
  user: BaseUserData;
  profile: UserProfileData;
  about: string | null;
  experience_years: number;
  skills: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string | null;
  is_verified: boolean;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
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
  first_name: string;
  last_name: string;
}

export interface FullUserData extends BaseUserData {
  email: string;
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
export const GENDER_OPTIONS: {
  value: UserProfileData["gender_code"];
  label: string;
}[] = [
  { value: "UNKNOWN", label: "Не указан" },
  { value: "MALE", label: "Мужчина" },
  { value: "FEMALE", label: "Женщина" },
  { value: "OTHER", label: "Другое" },
];

export interface User {
  id: number;
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
