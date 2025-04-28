// Константы для API и URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const DEFAULT_AVATAR_URL = "/media/defaults/default-avatar.png";
export const FALLBACK_AVATAR = "/placeholder-avatar.svg";

// Константы для ролей пользователей
export const USER_ROLES = {
  CLIENT: "CLIENT",
  THERAPIST: "THERAPIST",
  ADMIN: "ADMIN",
} as const;

// Константы для статусов
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
} as const;
