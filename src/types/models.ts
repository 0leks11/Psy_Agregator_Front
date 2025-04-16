export interface Skill {
  id: number;
  name: string;
  description?: string | null;
}

export interface Language {
  id: number;
  name: string;
  code?: string | null;
}

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN"; // Коды

export interface UserProfileData {
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  gender: Gender;
  gender_display: string;
  profile_picture_url: string | null;
}

export interface BaseUserData {
  id: number;
  first_name: string | null;
  last_name: string | null;
}

// --- Новые типы ---
export interface TherapistPhotoData {
  id: number;
  image: string; // URL картинки
  caption: string | null;
  order: number;
}

export interface PublicationData {
  id: number;
  author: string; // email автора (или можно BaseUserData)
  title: string;
  content: string; // Полное содержание для детального просмотра
  content_snippet?: string; // Краткое для списка
  featured_image: string | null; // URL картинки
  is_published: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// --- Обновленные типы профилей ---

// Данные для РЕДАКТИРОВАНИЯ профиля терапевта (включая M2M ID)
export interface TherapistProfileEditData {
  about: string | null;
  experience_years: number;
  skills: number[]; // Массив ID
  languages: number[]; // Массив ID
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string | null;
  // Новые поля
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  // Добавить другие соцсети если нужно
}

// Полные данные профиля терапевта для ЛИЧНОГО КАБИНЕТА (включая все поля и объекты фото)
export interface TherapistProfilePrivateData extends TherapistProfileEditData {
  id: number; // ID профиля терапевта
  is_verified: boolean;
  is_subscribed: boolean;
  photos: TherapistPhotoData[]; // Массив объектов фото
  // M2M поля могут быть как ID, так и объекты, в зависимости от сериализатора
  // skills: number[] | Skill[];
  // languages: number[] | Language[];
}

// Данные для ПУБЛИЧНОГО отображения профиля терапевта (только читаемые поля)
export interface TherapistPublicProfileData {
  id: number; // ID профиля терапевта
  user: BaseUserData;
  profile: UserProfileData; // Фото, гендер
  about: string | null;
  experience_years: number;
  skills: string[]; // Имена навыков
  languages: string[]; // Имена языков
  total_hours_worked: number | null; // null если display_hours=false
  office_location: string | null;
  is_verified: boolean;
  // Новые поля
  photos: TherapistPhotoData[]; // Объекты фото
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  // Добавить другие соцсети
}

export interface ClientProfileData {
  id: number; // ID профиля клиента
  request_details: string | null;
  interested_topics: number[]; // Массив ID
}

export interface ClientProfileReadData
  extends Omit<ClientProfileData, "interested_topics"> {
  interested_topics: string[]; // Имена тем
}

// Обновляем FullUserData для ЛК
export interface FullUserData extends BaseUserData {
  email: string;
  profile: UserProfileData;
  therapist_profile?: TherapistProfilePrivateData; // Используем приватные данные для ЛК
  client_profile?: ClientProfileData; // Или ClientProfileReadData
}
