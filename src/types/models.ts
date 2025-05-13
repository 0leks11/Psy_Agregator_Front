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
  public_id: string;
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
  skills: number[]; // Массив ID для отправки
  languages: number[]; // Массив ID для отправки
  total_hours_worked: number | null;
  display_hours: boolean;
  office_location: string | null;
  // Новые поля
  video_intro_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  // Добавить другие соцсети если нужно
}

// Полные данные профиля терапевта для ЛИЧНОГО КАБИНЕТА
// Используем Omit для наследования без конфликтующих полей
export interface TherapistProfilePrivateData
  extends Omit<TherapistProfileEditData, "skills" | "languages"> {
  // Исключаем skills и languages из наследования
  id: number;
  is_verified: boolean;
  is_subscribed: boolean;
  photos: TherapistPhotoData[];
  // Явно добавляем skills и languages с правильными типами
  skills: Skill[];
  languages: Language[];
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
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  created_at: string;
  updated_at: string;
  profile: UserProfileData;
  therapist_profile?: TherapistProfilePrivateData;
  client_profile?: ClientProfileData;
}

// Полное определение публикации
export interface Publication {
  id: number | string; // Может быть числом или UUID
  title: string;
  content: string;
  created_at: string; // Дата в виде строки ISO
  updated_at?: string;
  author_id?: number; // ID автора
  author?: string | BaseUserData; // Имя автора или объект с данными
  featured_image?: string | null; // URL картинки
  is_published?: boolean;
}

// Общий интерфейс для пропсов в секциях профиля
export interface ProfileSectionProps {
  userData: FullUserData;
  isEditable: boolean;
}

// Интерфейс для пропсов PublicationForm
export interface PublicationFormProps {
  onPostSaved: (newPost: Publication) => void;
  onCancel: () => void;
  initialData?: Partial<Publication>; // Для редактирования существующих
}

// Интерфейс для пропсов PublicationItem
export interface PublicationItemProps {
  publication: Publication;
  isEditable: boolean;
  onPostDeleted?: (id: number | string) => void;
  onPostUpdated?: (post: Publication) => void;
}

// Интерфейсы для карточек терапевтов
export interface ApiProfileCardData {
  profile_picture_url: string | null;
}

export interface ApiTherapistProfileCardData {
  about: string | null;
  experience_years: number;
  is_verified: boolean;
  skills: Array<{ id: number; name: string }>; // Массив объектов
  skills_count: number; // Общее количество
}

export interface ApiTherapistListData {
  id: number; // User ID
  public_id: string;
  first_name: string;
  last_name: string;
  profile: ApiProfileCardData | null;
  therapist_profile: ApiTherapistProfileCardData | null;
}

// Добавляю в конец файла новый тип
export interface ProfilePublicationsSectionProps extends ProfileSectionProps {
  initialPublications?: Publication[] | null;
}

// Добавляем новый интерфейс для данных регистрации
export interface UserRegistrationData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: "CLIENT" | "THERAPIST" | "ADMIN";
  invite_code?: string;
}
