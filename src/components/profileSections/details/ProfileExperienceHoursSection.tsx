import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { AuthContext } from "../../../contexts/authContextDefinition";
import { updateTherapistProfile } from "../../../services/profileService";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import ProfileWrapper from "../common/ProfileWrapper";
import { toast } from "react-toastify";
import { ProfileSectionProps } from "../../../types/models";

const ProfileExperienceHoursSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useContext(AuthContext) || {};
  if (!updateUserState) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояния для полей ввода - используем string для большей гибкости
  const [experienceYears, setExperienceYears] = useState<number | string>("");
  const [totalHours, setTotalHours] = useState<number | string>("");
  const [displayHours, setDisplayHours] = useState<boolean>(false);

  // Начальные значения для отмены изменений
  const [initialExperienceYears, setInitialExperienceYears] = useState<
    number | string
  >("");
  const [initialTotalHours, setInitialTotalHours] = useState<number | string>(
    ""
  );
  const [initialDisplayHours, setInitialDisplayHours] =
    useState<boolean>(false);

  const isTherapist = userData?.profile?.role === "THERAPIST";
  const sectionTitle = "Опыт и Практика";

  // Загружаем текущие значения из профиля
  useEffect(() => {
    if (isTherapist && userData?.therapist_profile) {
      const profile = userData.therapist_profile;
      const years = profile.experience_years ?? "";
      const hours = profile.total_hours_worked ?? "";
      const display = profile.display_hours ?? false;

      setExperienceYears(years);
      setTotalHours(hours);
      setDisplayHours(display);

      setInitialExperienceYears(years);
      setInitialTotalHours(hours);
      setInitialDisplayHours(display);
    }
  }, [userData, isTherapist]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    // Возвращаем начальные значения
    setExperienceYears(initialExperienceYears);
    setTotalHours(initialTotalHours);
    setDisplayHours(initialDisplayHours);
    setIsEditing(false);
    setError(null);
  };

  // Вспомогательная функция для безопасной обработки числовых значений
  const parseNumericInput = (value: string | number): number | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) || num < 0 ? null : Math.floor(num); // Только положительные целые числа, null если некорректно
  };

  const handleSaveClick = async () => {
    if (!userData || !isTherapist) return;

    const yearsValue = parseNumericInput(experienceYears);
    const hoursValue = parseNumericInput(totalHours);

    // Базовая валидация (опциональная, бэкенд тоже должен проверять)
    if (yearsValue === null && experienceYears !== "") {
      setError(
        "Пожалуйста, введите корректное число лет опыта (целое, не отрицательное)."
      );
      return;
    }
    if (hoursValue === null && totalHours !== "") {
      setError(
        "Пожалуйста, введите корректное число часов практики (целое, не отрицательное)."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        experience_years: yearsValue ?? 0, // Отправляем 0, если значение null
        total_hours_worked: hoursValue, // Отправляем null, если поле пустое или некорректное
        display_hours: displayHours,
      };

      const updatedUserData = await updateTherapistProfile(payload);

      if (updatedUserData) {
        updateUserState(updatedUserData);

        // Обновляем начальные значения
        setInitialExperienceYears(
          updatedUserData.therapist_profile?.experience_years ?? ""
        );
        setInitialTotalHours(
          updatedUserData.therapist_profile?.total_hours_worked ?? ""
        );
        setInitialDisplayHours(
          updatedUserData.therapist_profile?.display_hours ?? false
        );

        setIsEditing(false);
        toast.success(`${sectionTitle} - сохранено!`);
      } else {
        throw new Error("Не удалось обновить профиль");
      }
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ||
        (err as Error)?.message ||
        "Не удалось сохранить изменения.";
      setError(errMsg);
      toast.error(`Ошибка: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем компонент только для терапевтов
  if (!isTherapist) {
    return null;
  }

  return (
    <ProfileWrapper
      title={sectionTitle}
      isEditable={isEditable} // Предполагается, что редактирует свой профиль
      isEditing={isEditing}
      onEditClick={handleEditClick}
    >
      {isEditing ? (
        // Режим редактирования
        <div className="space-y-4">
          <div>
            <label
              htmlFor="experienceYears"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Лет опыта
            </label>
            <input
              type="number"
              id="experienceYears"
              min="0"
              step="1"
              value={experienceYears}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setExperienceYears(e.target.value)
              }
              placeholder="0"
              className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="totalHours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Всего часов практики (опционально)
            </label>
            <input
              type="number"
              id="totalHours"
              min="0"
              step="1"
              value={totalHours}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTotalHours(e.target.value)
              }
              placeholder="Напр., 500"
              className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="displayHours"
              checked={displayHours}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDisplayHours(e.target.checked)
              }
              disabled={isLoading || totalHours === "" || totalHours === null} // Отключаем, если часы не указаны
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="displayHours"
              className="ml-2 block text-sm text-gray-700"
            >
              Показывать часы практики в публичном профиле
            </label>
          </div>

          {error && <ErrorMessage message={error} />}
          <EditControls
            isLoading={isLoading}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
          />
        </div>
      ) : (
        // Режим отображения
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Лет опыта:</strong>{" "}
            {userData?.therapist_profile?.experience_years ?? "Не указано"}
          </p>
          {/* Показываем часы только если разрешено и они указаны */}
          {userData?.therapist_profile?.display_hours &&
            userData?.therapist_profile?.total_hours_worked !== null && (
              <p>
                <strong>Часов практики:</strong>{" "}
                {userData.therapist_profile.total_hours_worked}
              </p>
            )}
          {!userData?.therapist_profile?.display_hours &&
            isEditable &&
            userData?.therapist_profile?.total_hours_worked !== null && (
              <p className="text-sm text-gray-500 italic">
                (Часы практики скрыты)
              </p>
            )}
          {userData?.therapist_profile?.total_hours_worked === null && (
            <p>
              <strong>Часов практики:</strong> Не указано
            </p>
          )}
        </div>
      )}
    </ProfileWrapper>
  );
};

export default ProfileExperienceHoursSection;
