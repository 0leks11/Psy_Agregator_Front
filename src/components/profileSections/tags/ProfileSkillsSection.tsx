import React, { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getSkills,
  updateTherapistProfile,
} from "../../../services/profileService";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import ProfileWrapper from "../common/ProfileWrapper";
import { toast } from "react-toastify";

interface ProfileSectionProps {
  userData: any; // Используем any, чтобы избежать проблем с типами
  isEditable: boolean;
}

interface SkillOption {
  id: number;
  name: string;
}

const ProfileSkillsSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [initialSkillIds, setInitialSkillIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Для операции сохранения
  const [isOptionsLoading, setIsOptionsLoading] = useState(false); // Для загрузки списка навыков
  const [error, setError] = useState<string | null>(null);

  const isTherapist = userData?.profile?.role === "THERAPIST";
  const sectionTitle = "Навыки и Специализации";

  // Загружаем доступные навыки при монтировании
  useEffect(() => {
    const fetchOptions = async () => {
      setIsOptionsLoading(true);
      try {
        const skillsData = await getSkills();
        setAvailableSkills(skillsData.map((s) => ({ id: s.id, name: s.name })));
      } catch (err) {
        console.error("Ошибка загрузки навыков:", err);
        setError("Не удалось загрузить список навыков.");
      } finally {
        setIsOptionsLoading(false);
      }
    };

    if (isTherapist) {
      fetchOptions();
    }
  }, [isTherapist]);

  // Устанавливаем выбранные навыки на основе данных пользователя
  useEffect(() => {
    let currentSkillIds: number[] = [];
    if (isTherapist && userData?.therapist_profile?.skills) {
      // Предполагаем, что skills - это массив объектов {id, name}
      currentSkillIds = userData.therapist_profile.skills.map((s: any) => s.id);
    }
    setSelectedSkillIds(currentSkillIds);
    setInitialSkillIds(currentSkillIds);
  }, [userData, isTherapist]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    setSelectedSkillIds(initialSkillIds);
    setIsEditing(false);
    setError(null);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const skillId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    setSelectedSkillIds((prev) =>
      isChecked ? [...prev, skillId] : prev.filter((id) => id !== skillId)
    );
  };

  const handleSaveClick = async () => {
    if (!userData || !isTherapist) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = { skills: selectedSkillIds }; // Отправляем массив идентификаторов
      const updatedUserData = await updateTherapistProfile(payload);

      if (updatedUserData) {
        updateUserState(updatedUserData);
        setInitialSkillIds(selectedSkillIds); // Обновляем начальное состояние при успехе
        setIsEditing(false);
        toast.success(`${sectionTitle} - сохранено!`);
      } else {
        throw new Error("Не удалось обновить профиль.");
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.skills?.[0] ||
        err.message ||
        "Не удалось сохранить изменения.";
      setError(errMsg);
      toast.error(`Ошибка: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillNameById = (id: number): string => {
    return availableSkills.find((s) => s.id === id)?.name || `ID: ${id}`;
  };

  // Показываем секцию только для терапевтов
  if (!isTherapist) {
    return null;
  }

  return (
    <ProfileWrapper
      title={sectionTitle}
      isEditable={isEditable}
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
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`skill-${skill.id}`}
                      value={skill.id}
                      checked={selectedSkillIds.includes(skill.id)}
                      onChange={handleCheckboxChange}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`skill-${skill.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {skill.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-full">
                  Список навыков пуст.
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
          {userData?.therapist_profile?.skills &&
          userData.therapist_profile.skills.length > 0 ? (
            userData.therapist_profile.skills.map(
              (skill: { id: number; name: string }) => (
                <span
                  key={skill.id}
                  className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {skill.name}
                </span>
              )
            )
          ) : (
            <p className="text-gray-400 italic">Не выбрано</p>
          )}
        </div>
      )}
    </ProfileWrapper>
  );
};

export default ProfileSkillsSection;
