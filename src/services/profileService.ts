import  api  from "./api";
import {
  SkillData,
  LanguageData,
  FullUserData,
  ProfileUpdateData,
  TherapistProfileUpdateData,
  ClientProfileUpdateData,
} from "../types/user";

export const getSkills = async (): Promise<SkillData[]> => {
  const response = await api.get<SkillData[]>("/skills/");
  return response.data;
};

export const getLanguages = async (): Promise<LanguageData[]> => {
  const response = await api.get<LanguageData[]>("/languages/");
  return response.data;
};

export const updateBaseProfile = async (
  data: ProfileUpdateData
): Promise<FullUserData> => {
  const response = await api.put<FullUserData>("/user/profile/", data);
  return response.data;
};

export const updateProfilePicture = async (
  formData: FormData
): Promise<FullUserData> => {
  const response = await api.put<FullUserData>(
    "/user/profile/picture/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateTherapistProfile = async (
  data: TherapistProfileUpdateData
): Promise<FullUserData> => {
  const response = await api.put<FullUserData>(
    "/user/profile/therapist/",
    data
  );
  return response.data;
};

export const updateClientProfile = async (
  data: ClientProfileUpdateData
): Promise<FullUserData> => {
  const response = await api.put<FullUserData>("/user/profile/client/", data);
  return response.data;
};

export const getMyProfile = async (): Promise<FullUserData> => {
  const response = await api.get<FullUserData>("/auth/user/");
  return response.data;
};
