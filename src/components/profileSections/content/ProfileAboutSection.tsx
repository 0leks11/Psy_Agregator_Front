// src/components/profileSections/ProfileAboutSection.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  updateTherapistProfile,
  updateClientProfile,
} from "../../../services/profileService";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import ProfileWrapper from "../common/ProfileWrapper";
import { toast } from "react-toastify";

interface ProfileSectionProps {
  userData: any; // Используем any, чтобы избежать проблем с типами
  isEditable: boolean;
}

const ProfileAboutSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [initialText, setInitialText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTherapist = userData?.profile?.role === "THERAPIST";
  const fieldName = isTherapist ? "about" : "request_details";
  const sectionTitle = isTherapist ? "О себе" : "Мой запрос";

  useEffect(() => {
    let currentText = "";
    if (isTherapist && userData?.therapist_profile) {
      currentText = userData.therapist_profile.about || "";
    } else if (!isTherapist && userData?.client_profile) {
      currentText = userData.client_profile.request_details || "";
    }
    setAboutText(currentText);
    setInitialText(currentText);
  }, [userData, isTherapist]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    setAboutText(initialText);
    setIsEditing(false);
    setError(null);
  };

  const handleSaveClick = async () => {
    if (!userData) return;

    setIsLoading(true);
    setError(null);
    try {
      const payload = { [fieldName]: aboutText };
      const updatedUserData = isTherapist
        ? await updateTherapistProfile(payload)
        : await updateClientProfile(payload);

      if (updatedUserData) {
        updateUserState(updatedUserData);
        setInitialText(aboutText);
        setIsEditing(false);
        toast.success(`${sectionTitle} - сохранено!`);
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.detail ||
        err.message ||
        "Не удалось сохранить изменения.";
      setError(errMsg);
      toast.error(`Ошибка: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileWrapper
      title={sectionTitle}
      isEditable={isEditable}
      isEditing={isEditing}
      onEditClick={handleEditClick}
    >
      {isEditing ? (
        <div>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out min-h-[150px]"
            rows={6}
            disabled={isLoading}
          />
          {error && <ErrorMessage message={error} />}
          <EditControls
            isLoading={isLoading}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
          />
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">
          {aboutText || (
            <span className="text-gray-400 italic">
              Информация не заполнена
            </span>
          )}
        </p>
      )}
    </ProfileWrapper>
  );
};

export default ProfileAboutSection;
