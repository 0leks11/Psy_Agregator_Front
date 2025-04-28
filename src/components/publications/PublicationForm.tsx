// src/components/publications/PublicationForm.tsx
import React, { useState, useEffect } from "react";
import { Publication } from "../../types/models"; // Импорт типа
import {
  addPublication,
  updatePublication,
} from "../../services/publicationService"; // Импорт API функций
import EditControls from "../common/EditControls"; // Используем общие кнопки
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner"; // Импорт спиннера
import { useParams } from "react-router-dom";

interface PublicationFormProps {
  existingPublication?: Publication; // Для режима редактирования
  onPostSaved: (post: Publication) => void; // Колбэк при успехе
  onCancel: () => void; // Колбэк для отмены/закрытия
  isEditing?: boolean; // Флаг режима
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  existingPublication,
  onPostSaved,
  onCancel,
  isEditing = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { publicId } = useParams<{ publicId: string }>();

  const defaultAvatar = "/media/defaults/default-avatar.png";

  useEffect(() => {
    if (isEditing && existingPublication) {
      setTitle(existingPublication.title || "");
      setContent(existingPublication.content || "");
    } else {
      // Сброс для новой публикации
      setTitle("");
      setContent("");
    }
  }, [isEditing, existingPublication]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    // Простая валидация
    if (!content.trim()) {
      setError("Содержание публикации не может быть пустым.");
      setIsLoading(false);
      return;
    }

    const publicationData = { title, content };

    try {
      let savedPost: Publication;
      if (isEditing && existingPublication) {
        // Режим редактирования
        savedPost = await updatePublication(
          existingPublication.id,
          publicationData
        );
      } else {
        // Режим добавления
        savedPost = await addPublication(publicationData);
      }
      onPostSaved(savedPost); // Вызываем колбэк с результатом
      // Сброс формы не нужен здесь, т.к. компонент либо скроется, либо обновится
    } catch (err: any) {
      console.error("Error saving publication:", err);
      const errMsg =
        err.response?.data?.detail ||
        err.message ||
        "Не удалось сохранить публикацию.";
      setError(errMsg);
      // Не вызываем onCancel при ошибке, чтобы пользователь мог исправить
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isEditing && !existingPublication && (
        <ErrorMessage message="Ошибка: нет данных для редактирования." />
      )}
      <input
        type="text"
        placeholder="Заголовок (необязательно)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      />
      <textarea
        placeholder="Напишите что-нибудь..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        rows={isEditing ? 8 : 4} // Больше места при редактировании
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out min-h-[100px]"
      />
      {error && <ErrorMessage message={error} />}
      <EditControls
        isLoading={isLoading}
        onCancel={onCancel} // Используем переданный onCancel
        onSave={handleSubmit}
        saveText={isEditing ? "Сохранить изменения" : "Опубликовать"}
      />
    </div>
  );
};

export default PublicationForm;
