import api from "./api";
import {
  SkillData,
  LanguageData,
  FullUserData,
  ProfileUpdateData,
  TherapistProfileUpdateData,
  ClientProfileUpdateData,
} from "../types/types";
import { TherapistPhotoData, PublicationData } from "../types/models";

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
  const response = await api.patch<FullUserData>("/profile/update/base/", data);
  return response.data;
};

export const updateProfilePicture = async (
  formData: FormData
): Promise<FullUserData> => {
  const response = await api.patch<FullUserData>(
    "/profile/update/picture/",
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
  const response = await api.patch<FullUserData>(
    "/profile/update/therapist/",
    data
  );
  return response.data;
};

export const updateClientProfile = async (
  data: ClientProfileUpdateData
): Promise<FullUserData> => {
  const response = await api.patch<FullUserData>(
    "/profile/update/client/",
    data
  );
  return response.data;
};

export const getMyProfile = async (): Promise<FullUserData> => {
  const response = await api.get<FullUserData>("/auth/user/");
  return response.data;
};

// --- Фотографии ---
export const addMyPhoto = async (
  formData: FormData
): Promise<TherapistPhotoData> => {
  // formData должен содержать 'image' и опционально 'caption', 'order'
  try {
    const response = await api.post<TherapistPhotoData>(
      "/profile/photos/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Add photo error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateMyPhoto = async (
  photoId: number,
  data: { caption?: string; order?: number }
): Promise<TherapistPhotoData> => {
  try {
    const response = await api.patch<TherapistPhotoData>(
      `/profile/photos/${photoId}/`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Update photo ${photoId} error:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteMyPhoto = async (photoId: number): Promise<void> => {
  try {
    await api.delete(`/profile/photos/${photoId}/`);
  } catch (error: any) {
    console.error(
      `Delete photo ${photoId} error:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// --- Публикации ---
export const getMyPublications = async (): Promise<PublicationData[]> => {
  try {
    const response = await api.get<
      { results: PublicationData[] } | PublicationData[]
    >("/profile/publications/");
    // Проверяем, есть ли свойство results (пагинированный ответ) или сразу массив
    return "results" in response.data ? response.data.results : response.data;
  } catch (error: any) {
    console.error(
      "Get my publications error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createMyPublication = async (
  formData: FormData
): Promise<PublicationData> => {
  // formData: title, content, is_published, featured_image (optional)
  try {
    const response = await api.post<PublicationData>(
      "/profile/publications/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }, // Если есть картинка
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Create publication error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateMyPublication = async (
  pubId: number,
  formData: FormData
): Promise<PublicationData> => {
  try {
    // Используем POST с _method=PATCH если бэкенд не поддерживает PATCH для multipart
    // Или отправляем JSON если картинка не меняется
    const response = await api.patch<PublicationData>(
      `/profile/publications/${pubId}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Update publication ${pubId} error:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteMyPublication = async (pubId: number): Promise<void> => {
  try {
    await api.delete(`/profile/publications/${pubId}/`);
  } catch (error: any) {
    console.error(
      `Delete publication ${pubId} error:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
