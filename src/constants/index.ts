// Константы для API и URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const DEFAULT_AVATAR_URL = `${API_URL}/api/defaults/avatar/`;
export const BACKEND_DEFAULT_AVATAR_URL = `${API_URL}${DEFAULT_AVATAR_URL}`;
export const FALLBACK_AVATAR = "/placeholder-avatar.svg";

// Константы для ролей пользователей
export const USER_ROLES = {
  CLIENT: "CLIENT",
  THERAPIST: "THERAPIST",
  ADMIN: "ADMIN",
} as const;

// Константы для статусов подписки
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
} as const;
