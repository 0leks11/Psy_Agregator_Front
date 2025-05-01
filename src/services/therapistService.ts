import {
  TherapistProfileReadData,
  PublicationData,
  TherapistPhotoUploadData,
  PublicationCreateUpdateData,
  TherapistPublicData,
} from "../types/types";
import { PublicProfileData, ApiTherapistListData } from "../types/api";
import api from "./api";
import { AxiosError } from "axios";
import { TherapistPhotoData } from "../types/models";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getTherapists = async (): Promise<
  PaginatedResponse<ApiTherapistListData>
> => {
  try {
    const response = await api.get<PaginatedResponse<ApiTherapistListData>>(
      "/api/therapists/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching therapists:", error);
    throw error;
  }
};

export const getTherapistById = async (
  id: number
): Promise<TherapistProfileReadData> => {
  const response = await api.get<TherapistProfileReadData>(
    `/api/therapists/${id}/`
  );
  return response.data;
};

// --- НОВЫЕ ФУНКЦИИ ---
export const getPublicTherapistProfile = async (
  id: number
): Promise<TherapistPublicData> => {
  try {
    const response = await api.get(`/api/therapists/${id}/`);
    return response.data;
  } catch (error) {
    console.error(
      `Get public therapist ${id} error:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};

export const getTherapistPublications = async (
  therapistProfileId: number
): Promise<PublicationData[]> => {
  try {
    const response = await api.get(
      `/api/therapists/${therapistProfileId}/publications/`
    );
    // Обработка пагинации, если бэкенд ее использует
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    // Если нет пагинации или данные пришли как простой массив
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Возвращаем пустой массив если структура ответа неожиданная
    console.warn(
      "Unexpected response structure for publications:",
      response.data
    );
    return [];
  } catch (error) {
    console.error(
      `Get publications for therapist ${therapistProfileId} error:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};

// Новые методы для работы с фотографиями психологов
export const getTherapistPhotos = async (
  therapistId: number
): Promise<TherapistPhotoData[]> => {
  const response = await api.get<TherapistPhotoData[]>(
    `/api/therapists/${therapistId}/photos/`
  );
  return response.data;
};

export const uploadTherapistPhoto = async (
  therapistId: number,
  data: TherapistPhotoUploadData
): Promise<TherapistPhotoData> => {
  const formData = new FormData();
  formData.append("image", data.image);
  if (data.caption) {
    formData.append("caption", data.caption);
  }
  if (data.order !== undefined) {
    formData.append("order", data.order.toString());
  }

  const response = await api.post<TherapistPhotoData>(
    `/api/therapists/${therapistId}/photos/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteTherapistPhoto = async (
  therapistId: number,
  photoId: number
): Promise<void> => {
  await api.delete(`/api/therapists/${therapistId}/photos/${photoId}/`);
};

export const updateTherapistPhoto = async (
  therapistId: number,
  photoId: number,
  data: Partial<TherapistPhotoUploadData>
): Promise<TherapistPhotoData> => {
  const formData = new FormData();
  if (data.image) {
    formData.append("image", data.image);
  }
  if (data.caption !== undefined) {
    formData.append("caption", data.caption);
  }
  if (data.order !== undefined) {
    formData.append("order", data.order.toString());
  }

  if (
    formData.entries().next().done &&
    !data.caption &&
    data.order === undefined
  ) {
    console.warn("Update photo called with no data to update.");
    const currentPhoto = await api.get<TherapistPhotoData>(
      `/api/therapists/${therapistId}/photos/${photoId}/`
    );
    return currentPhoto.data;
  }

  const response = await api.patch<TherapistPhotoData>(
    `/api/therapists/${therapistId}/photos/${photoId}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Новые методы для работы с публикациями
export const getPublications = async (
  page: number = 1,
  limit: number = 10,
  authorId?: number
): Promise<{ data: PublicationData[]; total: number; pages: number }> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (authorId) {
    params.author = authorId.toString();
  }

  const response = await api.get<{
    results: PublicationData[];
    count: number;
    total_pages: number;
  }>("/api/publications/", { params });

  return {
    data: response.data.results,
    total: response.data.count,
    pages: response.data.total_pages,
  };
};

export const getPublicationById = async (
  id: number
): Promise<PublicationData> => {
  const response = await api.get<PublicationData>(`/api/publications/${id}/`);
  return response.data;
};

export const createPublication = async (
  publicationData: PublicationCreateUpdateData
): Promise<PublicationData> => {
  const formData = new FormData();
  formData.append("title", publicationData.title);
  formData.append("content", publicationData.content);

  if (publicationData.featured_image) {
    formData.append("featured_image", publicationData.featured_image);
  }

  if (publicationData.is_published !== undefined) {
    formData.append("is_published", publicationData.is_published.toString());
  }

  const response = await api.post<PublicationData>(
    "/api/publications/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updatePublication = async (
  id: number,
  publicationData: Partial<PublicationCreateUpdateData>
): Promise<PublicationData> => {
  // Используем FormData для работы с файлами изображений
  const formData = new FormData();

  if (publicationData.title !== undefined) {
    formData.append("title", publicationData.title);
  }

  if (publicationData.content !== undefined) {
    formData.append("content", publicationData.content);
  }

  if (publicationData.featured_image !== undefined) {
    if (publicationData.featured_image) {
      formData.append("featured_image", publicationData.featured_image);
    } else {
      // Если null, то удаляем изображение
      formData.append("remove_featured_image", "true");
    }
  }

  if (publicationData.is_published !== undefined) {
    formData.append("is_published", publicationData.is_published.toString());
  }

  const response = await api.patch<PublicationData>(
    `/api/publications/${id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deletePublication = async (id: number): Promise<void> => {
  await api.delete(`/api/publications/${id}/`);
};

export const createTherapistPublication = async (
  therapistId: number,
  data: { title: string; content: string }
): Promise<PublicationData> => {
  const response = await api.post<PublicationData>(
    `/api/therapists/${therapistId}/publications/`,
    data
  );
  return response.data;
};

export const updateTherapistPublication = async (
  therapistId: number,
  publicationId: number,
  data: { title: string; content: string }
): Promise<PublicationData> => {
  const response = await api.patch<PublicationData>(
    `/api/therapists/${therapistId}/publications/${publicationId}/`,
    data
  );
  return response.data;
};

export const deleteTherapistPublication = async (
  therapistId: number,
  publicationId: number
): Promise<void> => {
  await api.delete(
    `/api/therapists/${therapistId}/publications/${publicationId}/`
  );
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
    const axiosError = error as AxiosError;
    console.error(
      `Error fetching public profile for ${publicId}:`,
      axiosError.response?.data || axiosError.message
    );
    throw error;
  }
};
