// src/services/publicationService.ts
import api from "./api";
import { Publication } from "../types/models";

// Получение публикаций пользователя (заменить targetUserId на нужный параметр API)
export const getMyPublications = async (
  userId: number | string
): Promise<Publication[]> => {
  try {
    const response = await api.get(`/api/publications/?author=${userId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching publications:", error);
    throw error;
  }
};

// Добавление новой публикации
export const addPublication = async (data: {
  title: string;
  content: string;
}): Promise<Publication> => {
  try {
    const response = await api.post("/api/publications/", data);
    return response.data;
  } catch (error) {
    console.error("Error adding publication:", error);
    throw error;
  }
};

// Обновление существующей публикации
export const updatePublication = async (
  id: number | string,
  data: { title: string; content: string }
): Promise<Publication> => {
  try {
    const response = await api.patch(`/api/publications/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating publication:", error);
    throw error;
  }
};

// Удаление публикации
export const deletePublication = async (id: number | string): Promise<void> => {
  try {
    await api.delete(`/api/publications/${id}/`);
  } catch (error) {
    console.error("Error deleting publication:", error);
    throw error;
  }
};
