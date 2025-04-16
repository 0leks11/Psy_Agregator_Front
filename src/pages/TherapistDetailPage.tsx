import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getTherapistById,
  getTherapistPhotos,
} from "../services/therapistService";
import {
  TherapistPublicProfileData,
  TherapistPhotoData,
} from "../types/models";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import PhotoGallery from "../components/therapists/PhotoGallery";

const TherapistDetailPage: React.FC = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<TherapistPublicProfileData | null>(
    null
  );
  const [photos, setPhotos] = useState<TherapistPhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const defaultImage = "/default-avatar.png";

  useEffect(() => {
    const fetchTherapist = async () => {
      if (!therapistId) {
        setError("ID специалиста отсутствует.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const data = await getTherapistById(parseInt(therapistId, 10));
        setTherapist(data);

        // Загружаем фотографии психолога
        const photosData = await getTherapistPhotos(parseInt(therapistId, 10));
        setPhotos(photosData);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            "Не удалось загрузить информацию о специалисте."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [therapistId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  if (error) return <ErrorMessage message={error} />;
  if (!therapist) return <ErrorMessage message="Специалист не найден." />;

  // Функция для форматирования URL (добавляет https:// если его нет)
  const formatUrl = (url: string | null): string => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        {/* Заголовок и основная информация */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-6 md:mb-8">
          <img
            src={therapist.profile.profile_picture_url || defaultImage}
            alt={`${therapist.user.first_name} ${therapist.user.last_name}`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-2 border-gray-200"
            onError={(e) => (e.currentTarget.src = defaultImage)}
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {therapist.user.first_name} {therapist.user.last_name}
            </h1>
            {therapist.profile.gender !== "UNKNOWN" && (
              <p className="text-md text-gray-500 mb-2">
                {therapist.profile.gender_display}
              </p>
            )}
            <p className="text-lg text-blue-600 font-semibold mb-2">
              {therapist.experience_years} лет опыта
            </p>
            <p className="text-sm text-gray-600">
              Формат/Местоположение: {therapist.office_location || "Не указано"}
            </p>

            {/* Социальные сети и контакты */}
            <div className="mt-3 flex flex-wrap justify-center md:justify-start space-x-3">
              {therapist.website_url && (
                <a
                  href={formatUrl(therapist.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <i className="fas fa-globe mr-1"></i> Сайт
                </a>
              )}
              {therapist.linkedin_url && (
                <a
                  href={formatUrl(therapist.linkedin_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <i className="fab fa-linkedin mr-1"></i> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Видео-визитка */}
        {therapist.video_intro_url && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Видео-визитка
            </h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={therapist.video_intro_url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full rounded-lg shadow-md"
                style={{ height: "315px" }}
              ></iframe>
            </div>
          </div>
        )}

        {/* О себе */}
        {therapist.about && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">О себе</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {therapist.about}
            </p>
          </div>
        )}

        {/* Галерея фотографий */}
        {therapist.photos && therapist.photos.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <PhotoGallery photos={therapist.photos} />
          </div>
        )}

        {/* Специализация */}
        {therapist.skills && therapist.skills.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Специализация
            </h2>
            <div className="flex flex-wrap gap-2">
              {therapist.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Языки */}
        {therapist.languages && therapist.languages.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Языки</h2>
            <div className="flex flex-wrap gap-2">
              {therapist.languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Часы практики */}
        {therapist.total_hours_worked !== null && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Часы практики
            </h2>
            <p className="text-gray-600">
              {therapist.total_hours_worked} часов
            </p>
            <p className="text-xs text-gray-500 italic">
              (По данным специалиста)
            </p>
          </div>
        )}

        {/* Контактная информация */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Контактная информация
          </h2>
          <p className="text-gray-600 mb-4">
            Контактная информация доступна после авторизации или прямого
            запроса.
          </p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150"
            disabled
          >
            Записаться на консультацию (в разработке)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetailPage;
