import React, { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getLanguages,
  updateTherapistProfile,
} from "../../../services/profileService";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import ProfileWrapper from "../common/ProfileWrapper";
import { toast } from "react-toastify";
import { ProfileSectionProps, Language } from "../../../types/models";

const ProfileLanguagesSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [initialLanguageIds, setInitialLanguageIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Для операции сохранения
  const [isOptionsLoading, setIsOptionsLoading] = useState(false); // Для загрузки списка языков
  const [error, setError] = useState<string | null>(null);

  const isTherapist = userData?.profile?.role === "THERAPIST";
  const sectionTitle = "Языки консультаций";

  // Загружаем доступные языки при монтировании
  useEffect(() => {
    const fetchOptions = async () => {
      setIsOptionsLoading(true);
      try {
        const languagesData = await getLanguages();
        // Используем тип Language
        setAvailableLanguages(
          languagesData.map((l) => ({ id: l.id, name: l.name }))
        );
      } catch (err) {
        console.error("Ошибка загрузки языков:", err);
        setError("Не удалось загрузить список языков.");
        toast.error("Не удалось загрузить список языков.");
      } finally {
        setIsOptionsLoading(false);
      }
    };

    if (isTherapist) {
      fetchOptions();
    }
  }, [isTherapist]);

  // Устанавливаем выбранные языки на основе данных пользователя
  useEffect(() => {
    let currentLanguageIds: number[] = [];
    if (isTherapist && userData?.therapist_profile?.languages) {
      // Тип languages теперь Language[], можно напрямую мапить
      const therapistLanguages = userData.therapist_profile.languages;
      if (Array.isArray(therapistLanguages)) {
        currentLanguageIds = therapistLanguages.map((language) => language.id);
      }
    }
    setSelectedLanguageIds(currentLanguageIds);
    setInitialLanguageIds(currentLanguageIds);
  }, [userData, isTherapist]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    setSelectedLanguageIds(initialLanguageIds);
    setIsEditing(false);
    setError(null);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const languageId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    setSelectedLanguageIds((prev) =>
      isChecked ? [...prev, languageId] : prev.filter((id) => id !== languageId)
    );
  };

  const handleSaveClick = async () => {
    if (!userData || !isTherapist) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = { languages: selectedLanguageIds }; // Отправляем массив идентификаторов
      const updatedUserData = await updateTherapistProfile(payload);

      if (updatedUserData) {
        updateUserState(updatedUserData);
        setInitialLanguageIds(selectedLanguageIds); // Обновляем начальное состояние при успехе
        setIsEditing(false);
        toast.success(`${sectionTitle} - сохранено!`);
      } else {
        throw new Error("Не удалось обновить профиль.");
      }
    } catch (err: unknown) {
      const errMsg =
        (
          err as {
            response?: { data?: { detail?: string; languages?: string[] } };
          }
        )?.response?.data?.detail ||
        (err as { response?: { data?: { languages?: string[] } } })?.response
          ?.data?.languages?.[0] ||
        (err as Error)?.message ||
        "Не удалось сохранить изменения.";
      setError(errMsg);
      toast.error(`Ошибка: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем секцию только для терапевтов
  if (!isTherapist && !isEditable) {
    // Не показываем для клиентов в публичном профиле
    return null;
  }

  if (!isTherapist && isEditable) {
    // Не показываем для клиентов в их собственном профиле
    return null;
  }

  return (
    <ProfileWrapper
      title={sectionTitle}
      isEditable={isEditable && isTherapist} // Только терапевт может редактировать секцию
      isEditing={isEditing}
      onEditClick={handleEditClick}
    >
      {isEditing ? (
        // Режим редактирования: Чекбоксы
        <div>
          {isOptionsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border rounded">
              {availableLanguages.length > 0 ? (
                availableLanguages.map((language) => (
                  <div key={language.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`language-${language.id}`}
                      value={language.id}
                      checked={selectedLanguageIds.includes(language.id)}
                      onChange={handleCheckboxChange}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`language-${language.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {language.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-full">
                  Список языков пуст.
                </p>
              )}
            </div>
          )}
          {error && <ErrorMessage message={error} />}
          <EditControls
            isLoading={isLoading}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
          />
        </div>
      ) : (
        // Режим отображения: Бейджи/Список
        <div className="flex flex-wrap gap-2">
          {userData?.therapist_profile?.languages &&
          userData.therapist_profile.languages.length > 0 ? (
            userData.therapist_profile.languages.map((language) => (
              <span
                key={language.id}
                className="inline-block bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {language.name}
              </span>
            ))
          ) : (
            <p className="text-gray-400 italic">Не указано</p>
          )}
        </div>
      )}
    </ProfileWrapper>
  );
};

export default ProfileLanguagesSection;
