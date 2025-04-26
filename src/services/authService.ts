import api from "./api";
import { FullUserData } from "../types/user";

interface LoginResponse {
  token: string;
  user: FullUserData;
}

interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  invite_code?: string;
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

export const registerClient = async (
  userData: RegisterCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/register/client/",
    userData
  );
  return response.data;
};

export const registerTherapist = async (
  userData: RegisterCredentials
): Promise<LoginResponse> => {
  if (!userData.invite_code) {
    throw new Error("Invite code is required for therapist registration");
  }
  const response = await api.post<LoginResponse>(
    "/api/auth/register/therapist/",
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
