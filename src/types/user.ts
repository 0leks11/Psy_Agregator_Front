// Типы для пользователя и профиля
export interface UserProfileData {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  gender_display: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface TherapistProfileData {
  id: number;
  user_profile: number;
  about: string;
  experience_years: number;
  office_location: string;
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  photos: string[];
  status: string | null;
  status_display: string | null;
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

export interface FullUserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile: UserProfileData;
  therapist_profile: TherapistProfileData | null;
  created_at: string;
  updated_at: string;
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
