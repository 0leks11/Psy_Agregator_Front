import { UserProfileData } from "./models";

// Типы для форм
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "CLIENT" | "THERAPIST";
}

export interface ProfileUpdateData {
  first_name: string;
  last_name: string;
  gender: UserProfileData["gender"];
}

export interface TherapistProfileUpdateData {
  about: string;
  experience_years: number;
  skills: number[];
  languages: number[];
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string;
}

export interface ClientProfileUpdateData {
  request_details: string;
  interested_topics: number[];
}
