import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateTherapistProfile } from "../../../services/profileService";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import ProfileWrapper from "../common/ProfileWrapper";
import { toast } from "react-toastify";
// Импортируйте иконки соцсетей (например, из react-icons)
// import { FaLinkedin, FaGlobe } from 'react-icons/fa';

interface ProfileSectionProps {
  userData: any;
  isEditable: boolean;
}

const ProfileSocialLinksSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояния для полей ввода
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");

  // Начальные значения для отмены изменений
  const [initialValues, setInitialValues] = useState({
    websiteUrl: "",
    linkedinUrl: "",
  });

  const isTherapist = userData?.profile?.role === "THERAPIST";

  // Загружаем текущие значения из профиля
  useEffect(() => {
    if (isTherapist && userData?.therapist_profile) {
      const therapistProfile = userData.therapist_profile;

      setWebsiteUrl(therapistProfile.website_url || "");
      setLinkedinUrl(therapistProfile.linkedin_url || "");

      setInitialValues({
        websiteUrl: therapistProfile.website_url || "",
        linkedinUrl: therapistProfile.linkedin_url || "",
      });
    }
  }, [userData, isTherapist]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    // Возвращаем начальные значения
    setWebsiteUrl(initialValues.websiteUrl);
    setLinkedinUrl(initialValues.linkedinUrl);

    setIsEditing(false);
    setError(null);
  };

  const handleSaveClick = async () => {
    if (!userData || !isTherapist) return;

    setIsLoading(true);
    setError(null);

    try {
      // Проверка формата URL, если не пустой
      const validateUrl = (url: string): boolean => {
        if (!url) return true; // Пустой URL допустим
        try {
          // Если URL не содержит протокол, добавляем https://
          const urlWithProtocol = url.match(/^https?:\/\//)
            ? url
            : `https://${url}`;
          new URL(urlWithProtocol);
          return true;
        } catch (e) {
          return false;
        }
      };

      if (!validateUrl(websiteUrl)) {
        throw new Error("Некорректный формат URL для веб-сайта");
      }

      if (!validateUrl(linkedinUrl)) {
        throw new Error("Некорректный формат URL для LinkedIn");
      }

      // Подготовка данных для отправки
      // Нормализуем URL перед отправкой
      const normalizeUrl = (url: string): string | null => {
        if (!url) return null;
        // Добавляем протокол, если его нет
        return url.match(/^https?:\/\//) ? url : `https://${url}`;
      };

      const payload = {
        website_url: normalizeUrl(websiteUrl),
        linkedin_url: normalizeUrl(linkedinUrl),
      };

      const updatedUserData = await updateTherapistProfile(payload);

      if (updatedUserData) {
        updateUserState(updatedUserData);

        // Обновляем начальные значения
        setInitialValues({
          websiteUrl,
          linkedinUrl,
        });

        setIsEditing(false);
        toast.success("Социальные ссылки обновлены!");
      } else {
        throw new Error("Не удалось обновить профиль");
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.detail ||
        err.message ||
        "Не удалось сохранить изменения";
      setError(errMsg);
      toast.error(`Ошибка: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для отображения ссылки
  const formatUrl = (url: string | null): string => {
    if (!url) return "";

    // Убираем протокол для отображения
    return url.replace(/^https?:\/\//, "");
  };

  const getHostNameFromUrl = (url: string | null): string => {
    if (!url) return "";
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, "");
    } catch (e) {
      return url;
    }
  };

  // Показываем компонент только для терапевтов
  if (!isTherapist) {
    return null;
  }

  return (
    <ProfileWrapper
      title="Социальные ссылки"
      isEditable={isEditable}
      isEditing={isEditing}
      onEditClick={handleEditClick}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Веб-сайт
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              placeholder="например: example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Можно указать без http:// или https://
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              placeholder="например: linkedin.com/in/username"
            />
          </div>

          {error && <ErrorMessage message={error} />}
          <EditControls
            isLoading={isLoading}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
          />
        </div>
      ) : (
        <div className="space-y-2">
          {userData?.therapist_profile?.website_url && (
            <p className="text-gray-700">
              <span className="font-medium">Веб-сайт:</span>{" "}
              <a
                href={userData.therapist_profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formatUrl(userData.therapist_profile.website_url)}
              </a>
            </p>
          )}

          {userData?.therapist_profile?.linkedin_url && (
            <p className="text-gray-700">
              <span className="font-medium">LinkedIn:</span>{" "}
              <a
                href={userData.therapist_profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {getHostNameFromUrl(userData.therapist_profile.linkedin_url)}
              </a>
            </p>
          )}

          {!userData?.therapist_profile?.website_url &&
            !userData?.therapist_profile?.linkedin_url && (
              <p className="text-gray-400 italic">Ссылки не указаны</p>
            )}
        </div>
      )}
    </ProfileWrapper>
  );
};

export default ProfileSocialLinksSection;
