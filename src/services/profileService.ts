import api from "./api";
import {
  ProfileUpdateData,
  TherapistProfileUpdateData,
  ClientProfileUpdateData,
} from "../types/types";
import {
  TherapistPhotoData,
  PublicationData,
  Skill,
  Language,
  FullUserData,
} from "../types/models";
import { PublicProfileData } from "../types/api";
import { AxiosError } from "axios";

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get<Skill[]>("/api/skills/");
  return response.data;
};

export const getLanguages = async (): Promise<Language[]> => {
  const response = await api.get<Language[]>("/api/languages/");
  return response.data;
};

export const updateBaseProfile = async (
  data: ProfileUpdateData
): Promise<FullUserData> => {
  const response = await api.patch<FullUserData>(
    "/api/profile/update/base/",
    data
  );
  return response.data;
};

export const updateProfilePicture = async (
  formData: FormData
): Promise<FullUserData> => {
  const response = await api.post<FullUserData>(
    "/api/profile/update/picture/",
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
    "/api/profile/update/therapist/",
    data
  );
  return response.data;
};

export const updateClientProfile = async (
  data: ClientProfileUpdateData
): Promise<FullUserData> => {
  const response = await api.patch<FullUserData>(
    "/api/profile/update/client/",
    data
  );
  return response.data;
};

export const getMyProfile = async (): Promise<FullUserData> => {
  const response = await api.get<FullUserData>("/api/auth/user/");
  return response.data;
};

// --- Фотографии ---
export const addMyPhoto = async (
  formData: FormData
): Promise<TherapistPhotoData> => {
  try {
    const response = await api.post<TherapistPhotoData>(
      "/api/profile/photos/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const errMsgPrefix = "Add photo error";
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось добавить фото"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

export const updateMyPhoto = async (
  photoId: number,
  data: { caption?: string; order?: number }
): Promise<TherapistPhotoData> => {
  try {
    const response = await api.patch<TherapistPhotoData>(
      `/api/profile/photos/${photoId}/`,
      data
    );
    return response.data;
  } catch (error) {
    const errMsgPrefix = `Update photo ${photoId} error`;
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось обновить фото"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

export const deleteMyPhoto = async (photoId: number): Promise<void> => {
  try {
    await api.delete(`/api/profile/photos/${photoId}/`);
  } catch (error) {
    const errMsgPrefix = `Delete photo ${photoId} error`;
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось удалить фото"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

// --- Публикации ---
export const getMyPublications = async (): Promise<PublicationData[]> => {
  try {
    const response = await api.get<
      { results: PublicationData[] } | PublicationData[]
    >("/api/profile/publications/");
    return "results" in response.data ? response.data.results : response.data;
  } catch (error) {
    const errMsgPrefix = "Get my publications error";
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось получить публикации"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

export const createMyPublication = async (
  formData: FormData
): Promise<PublicationData> => {
  try {
    const response = await api.post<PublicationData>(
      "/api/profile/publications/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const errMsgPrefix = "Create publication error";
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось создать публикацию"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

export const updateMyPublication = async (
  pubId: number,
  formData: FormData
): Promise<PublicationData> => {
  try {
    const response = await api.patch<PublicationData>(
      `/api/profile/publications/${pubId}/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    const errMsgPrefix = `Update publication ${pubId} error`;
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось обновить публикацию"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

export const deleteMyPublication = async (pubId: number): Promise<void> => {
  try {
    await api.delete(`/api/profile/publications/${pubId}/`);
  } catch (error) {
    const errMsgPrefix = `Delete publication ${pubId} error`;
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${
      specificError || "Не удалось удалить публикацию"
    }`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};

export const getPublicUserProfile = async (
  publicId: string
): Promise<PublicProfileData> => {
  try {
    const response = await api.get<PublicProfileData>(
      `/api/users/${publicId}/profile/`
    );
    return response.data;
  } catch (error) {
    const errMsgPrefix = `Error fetching public profile for ${publicId}`;
    let specificError = "";
    if (error instanceof AxiosError && error.response?.data?.detail) {
      specificError = error.response.data.detail;
    } else if (error instanceof AxiosError) {
      specificError = error.message;
    } else if (error instanceof Error) {
      specificError = error.message;
    }
    const errMsg = `${errMsgPrefix}: ${specificError || "Неизвестная ошибка"}`;
    console.error(errMsg, error);
    throw new Error(errMsg);
  }
};
