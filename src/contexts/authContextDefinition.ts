import { createContext } from "react";
import { FullUserData } from "../types/models";

// Тип контекста
export interface AuthContextType {
  user: FullUserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: "CLIENT" | "THERAPIST" | "ADMIN";
    invite_code?: string;
  }) => Promise<boolean>;
  updateUserState: (userData: FullUserData) => void;
}

// Контекст
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
 