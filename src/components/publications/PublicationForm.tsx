import React, { useState, useEffect } from "react";
import {
  PublicationData,
  PublicationCreateUpdateData,
} from "../../types/types";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

interface PublicationFormProps {
  initialData?: Partial<PublicationData>;
  onSubmit: (data: PublicationCreateUpdateData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.featured_image || null
  );
  const [isPublished, setIsPublished] = useState(
    initialData?.is_published !== false
  );
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setImagePreview(initialData.featured_image || null);
      setIsPublished(initialData.is_published !== false);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setLocalError("Размер изображения не должен превышать 2МБ");
        return;
      }

      setImage(file);
      setLocalError(null);

      // Показать предпросмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!title.trim()) {
      setLocalError("Заголовок обязателен");
      return;
    }

    if (!content.trim()) {
      setLocalError("Содержание публикации обязательно");
      return;
    }

    const data: PublicationCreateUpdateData = {
      title: title.trim(),
      content: content.trim(),
      is_published: isPublished,
    };

    if (image) {
      data.featured_image = image;
    } else if (initialData?.featured_image && imagePreview === null) {
      // Если было изображение, а теперь его удалили
      data.featured_image = null;
    }

    try {
      await onSubmit(data);
    } catch (err: any) {
      setLocalError(err.message || "Ошибка при сохранении публикации");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || localError) && (
        <ErrorMessage message={error || localError || ""} />
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Заголовок <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Заголовок публикации"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Содержание <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          disabled={loading}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Расскажите о своем методе, поделитесь советами или опытом..."
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">
          Для форматирования можно использовать переносы строк.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Изображение для публикации (опционально)
        </label>
        <div className="space-y-2">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Предпросмотр"
                className="max-h-60 rounded-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100"
              >
                &times;
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="isPublished"
          className="ml-2 block text-sm text-gray-900"
        >
          Опубликовать сразу
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : initialData ? (
            "Сохранить изменения"
          ) : (
            "Создать публикацию"
          )}
        </button>
      </div>
    </form>
  );
};

export default PublicationForm;
