import React, { useState, useEffect } from "react";
import {
  getTherapistPhotos,
  uploadTherapistPhoto,
  deleteTherapistPhoto,
  updateTherapistPhoto,
} from "../../services/therapistService";
import {
  TherapistPhotoData,
  TherapistPhotoUploadData,
} from "../../types/types";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

interface PhotoGalleryManagerProps {
  therapistId: number;
}

const PhotoGalleryManager: React.FC<PhotoGalleryManagerProps> = ({
  therapistId,
}) => {
  const [photos, setPhotos] = useState<TherapistPhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Состояние для новой фотографии
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // Загрузка всех фотографий
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const photosData = await getTherapistPhotos(therapistId);
        setPhotos(photosData);
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке фотографий");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [therapistId]);

  // Обработка выбора новой фотографии
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла не должен превышать 5МБ");
        return;
      }

      setNewImage(file);

      // Предпросмотр изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Загрузка новой фотографии
  const handleUpload = async () => {
    if (!newImage) {
      setError("Выберите изображение для загрузки");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const photoData: TherapistPhotoUploadData = {
        image: newImage,
        caption: newCaption,
        order: photos.length, // По умолчанию добавляем в конец
      };

      const uploadedPhoto = await uploadTherapistPhoto(therapistId, photoData);
      setPhotos([...photos, uploadedPhoto]);

      // Сброс формы
      setNewImage(null);
      setNewCaption("");
      setPreview(null);
    } catch (err: any) {
      setError(err.message || "Ошибка при загрузке фотографии");
    } finally {
      setUploading(false);
    }
  };

  // Удаление фотографии
  const handleDelete = async (photoId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту фотографию?")) {
      return;
    }

    try {
      await deleteTherapistPhoto(therapistId, photoId);
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении фотографии");
    }
  };

  // Обновление порядка фотографий (перемещение вверх/вниз)
  const handleReorder = async (photoId: number, direction: "up" | "down") => {
    const photoIndex = photos.findIndex((photo) => photo.id === photoId);
    if (photoIndex === -1) return;

    // Если первый элемент и направление вверх или последний элемент и направление вниз
    if (
      (photoIndex === 0 && direction === "up") ||
      (photoIndex === photos.length - 1 && direction === "down")
    ) {
      return;
    }

    const newPhotos = [...photos];
    const currentPhoto = newPhotos[photoIndex];
    const swapIndex = direction === "up" ? photoIndex - 1 : photoIndex + 1;
    const swapPhoto = newPhotos[swapIndex];

    try {
      // Обновляем порядок в API
      await updateTherapistPhoto(therapistId, currentPhoto.id, {
        order: swapPhoto.order,
      });
      await updateTherapistPhoto(therapistId, swapPhoto.id, {
        order: currentPhoto.order,
      });

      // Обновляем локальный массив
      [newPhotos[photoIndex], newPhotos[swapIndex]] = [
        newPhotos[swapIndex],
        newPhotos[photoIndex],
      ];
      setPhotos(newPhotos);
    } catch (err: any) {
      setError(err.message || "Ошибка при изменении порядка фотографий");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Управление фотогалереей
      </h2>

      {error && <ErrorMessage message={error} />}

      {/* Форма загрузки новой фотографии */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Добавить новую фотографию
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Выберите изображение
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подпись (опционально)
            </label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Описание изображения..."
            />
          </div>

          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Предпросмотр:</p>
              <img
                src={preview}
                alt="Предпросмотр"
                className="max-h-48 rounded-md shadow-sm"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!newImage || uploading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? <LoadingSpinner size="sm" /> : "Загрузить фотографию"}
          </button>
        </div>
      </div>

      {/* Список существующих фотографий */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Текущие фотографии
        </h3>

        {photos.length === 0 ? (
          <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">
            У вас пока нет фотографий в галерее
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="border rounded-md p-3 bg-white shadow-sm"
              >
                <img
                  src={photo.image}
                  alt={photo.caption || "Фото в галерее"}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />

                <p className="text-sm text-gray-700 mb-2">
                  {photo.caption || "Без подписи"}
                </p>

                <div className="flex justify-between items-center">
                  <div className="space-x-1">
                    <button
                      onClick={() => handleReorder(photo.id, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(photo.id, "down")}
                      disabled={index === photos.length - 1}
                      className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryManager;
