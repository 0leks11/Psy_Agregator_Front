// import { TherapistPhotoData } from "./models"; // Убираем неиспользуемый импорт

// Удаляем дубликаты, оставляем только BaseUserData, если он там уникален
// и GENDER_OPTIONS
export interface BaseUserData {
  id: number;
  public_id: string;
  first_name: string;
  last_name: string;
}

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";

// Опции для выбора пола (оставляем здесь или переносим в models.ts)
export const GENDER_OPTIONS: {
  value: Gender;
  label: string;
}[] = [
  { value: "MALE", label: "Мужчина" },
  { value: "FEMALE", label: "Женщина" },
  { value: "OTHER", label: "Другой" },
  { value: "UNKNOWN", label: "Не указан" },
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
