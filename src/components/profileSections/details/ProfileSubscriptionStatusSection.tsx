import React from "react";
import { FullUserData } from "../../../types/models";
import ProfileWrapper from "../common/ProfileWrapper";

interface ProfileSectionProps {
  userData: FullUserData;
  isEditable: boolean;
}

const ProfileSubscriptionStatusSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const isSubscribed = userData.therapist_profile?.is_subscribed;
  const status =
    isSubscribed === true
      ? "Активна"
      : isSubscribed === false
      ? "Неактивна"
      : "Не указан";

  return (
    <ProfileWrapper
      title="Статус подписки"
      isEditable={isEditable}
      isEditing={false}
      onEditClick={() => {}}
    >
      <p className="text-gray-700">{status}</p>
    </ProfileWrapper>
  );
};

export default ProfileSubscriptionStatusSection;
