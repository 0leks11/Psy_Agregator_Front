import React from "react";
import ProfileWrapper from "../common/ProfileWrapper";
import { FullUserData } from "../../../types/types";

interface ProfileSectionProps {
  userData: FullUserData;
  isEditable: boolean;
}

const ProfileSubscriptionStatusSection: React.FC<ProfileSectionProps> = ({
  userData,
}) => {
  const isTherapist = userData?.profile?.role === "THERAPIST";

  // Показываем компонент только для терапевтов
  if (!isTherapist) {
    return null;
  }

  const isSubscribed = userData?.therapist_profile?.is_subscribed ?? false;

  return (
    <ProfileWrapper
      title="Статус подписки"
      isEditable={false} // Этот компонент не редактируется
      isEditing={false}
      onEditClick={() => {}} // Пустая функция, т.к. редактирование невозможно
    >
      {isSubscribed ? (
        <div>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-green-100 text-green-800 rounded-full">
              ✓
            </span>
            <span className="text-green-700 font-medium">
              Активная подписка
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Ваш профиль виден пользователям, и вы можете получать запросы на
            консультации.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-red-100 text-red-800 rounded-full">
              ✕
            </span>
            <span className="text-red-700 font-medium">
              Подписка не активна
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Для получения запросов на консультации оформите подписку.
          </p>
          <button
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md text-sm transition duration-150"
            onClick={() => (window.location.href = "/subscription")}
          >
            Оформить подписку
          </button>
        </div>
      )}
    </ProfileWrapper>
  );
};

export default ProfileSubscriptionStatusSection;
