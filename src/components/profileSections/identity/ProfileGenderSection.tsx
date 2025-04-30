import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateBaseProfile } from "../../../services/profileService";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import ProfileWrapper from "../common/ProfileWrapper";
import { toast } from "react-toastify";
import { PencilIcon } from "@heroicons/react/24/outline";
import { GENDER_OPTIONS } from "../../../types/user";
interface ProfileSectionProps {
  userData: any;
  isEditable: boolean;
}

const ProfileGenderSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояние для выбранного пола
  const [gender, setGender] = useState("UNKNOWN");
  const [initialGender, setInitialGender] = useState("UNKNOWN");

  // Загружаем текущее значение из профиля
  useEffect(() => {
    if (userData?.profile) {
      const genderCode = userData.profile.gender_code || "UNKNOWN";
      setGender(genderCode);
      setInitialGender(genderCode);
    }
  }, [userData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    // Возвращаем начальное значение
    setGender(initialGender);
    setIsEditing(false);
    setError(null);
  };

  const handleSaveClick = async () => {
    if (!userData) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        gender: gender,
        gender_code: gender,
      };
      const updatedUserData = await updateBaseProfile(payload);

      if (updatedUserData) {
        updateUserState(updatedUserData);
        setInitialGender(gender);
        setIsEditing(false);
        toast.success("Пол обновлен!");
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

  // Получаем отображаемое значение пола
  const getGenderDisplay = () => {
    const option = GENDER_OPTIONS.find((opt) => opt.value === gender);
    return option ? option.label : "Не указано";
  };

  return (
    <ProfileWrapper
      title="Пол"
      isEditable={isEditable}
      isEditing={isEditing}
      onEditClick={handleEditClick}
    >
      {isEditing ? (
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {error && <ErrorMessage message={error} />}
          <EditControls
            isLoading={isLoading}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
          />
        </div>
      ) : (
        <p className="text-gray-700">{getGenderDisplay()}</p>
      )}
    </ProfileWrapper>
  );
};

export default ProfileGenderSection;
