import React from "react";
import { FullUserData } from "../../../types/user";
import ProfileWrapper from "../common/ProfileWrapper";

interface ProfileSectionProps {
  userData: FullUserData;
  isEditable: boolean;
}

const ProfileSubscriptionStatusSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const status = userData.therapist_profile?.status_display || "Не указан";

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
