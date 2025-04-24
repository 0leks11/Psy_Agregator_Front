import api from "./api";
import { FullUserData } from "../types/user";

interface LoginResponse {
  token: string;
  user: FullUserData;
}

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/login/",
    credentials
  );
  return response.data;
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "CLIENT" | "THERAPIST";
  invite_code?: string;
}): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/register/",
    userData
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<FullUserData | null> => {
  try {
    const response = await api.get<FullUserData>("/api/auth/user/");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};
