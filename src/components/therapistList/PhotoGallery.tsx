import React, { useState, useCallback, useEffect } from "react";
import { TherapistPhotoData } from "../../types/models";

interface PhotoGalleryProps {
  photos: TherapistPhotoData[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Оборачиваем в useCallback
  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []); // Пустой массив зависимостей, т.к. функция не зависит от пропсов или состояния

  // Обработчик для навигации с клавиатуры - ВЫЗЫВАЕМ РАНЬШЕ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Проверяем activeIndex здесь, чтобы не выполнять лишние действия
      if (activeIndex === null) return;

      if (e.key === "ArrowRight") {
        setActiveIndex((prevIndex) =>
          prevIndex !== null ? (prevIndex + 1) % photos.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prevIndex) =>
          prevIndex !== null
            ? (prevIndex - 1 + photos.length) % photos.length
            : null
        );
      } else if (e.key === "Escape") {
        closeLightbox(); // Вызываем функцию закрытия
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // Добавили closeLightbox в зависимости, т.к. она используется внутри
  }, [activeIndex, photos.length, closeLightbox]);

  // Теперь проверка на пустой массив фотографий
  if (photos.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const navigateNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null || photos.length <= 1) return;
    setActiveIndex((activeIndex + 1) % photos.length);
  };

  const navigatePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null || photos.length <= 1) return;
    setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">Галерея</h3>

      {/* Сетка с фотографиями */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer relative group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.image}
              alt={photo.caption || `Фото ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Лайтбокс */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
            onClick={closeLightbox}
          >
            &times;
          </div>

          <button
            className="absolute left-4 text-white text-5xl opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={navigatePrev}
          >
            &#8249;
          </button>

          <div className="max-w-3xl max-h-[80vh] flex flex-col items-center">
            <img
              src={photos[activeIndex].image}
              alt={photos[activeIndex].caption || `Фото ${activeIndex + 1}`}
              className="max-h-[70vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {photos[activeIndex].caption && (
              <div className="mt-3 text-white text-center">
                {photos[activeIndex].caption}
              </div>
            )}

            <div className="mt-2 text-gray-400 text-sm">
              {activeIndex + 1} / {photos.length}
            </div>
          </div>

          <button
            className="absolute right-4 text-white text-5xl opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={navigateNext}
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
