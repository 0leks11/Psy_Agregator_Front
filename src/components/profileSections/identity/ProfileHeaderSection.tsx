import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { FullUserData } from "../../../types/models"; // Исправляем путь импорта
import { useAuth } from "../../../hooks/useAuth"; // Исправляем путь к хуку
import {
  updateBaseProfile,
  updateProfilePicture,
} from "../../../services/profileService";
import ErrorMessage from "../../common/ErrorMessage";
import EditControls from "../../common/EditControls";
import { CameraIcon } from "@heroicons/react/24/solid"; // For upload and edit icons
import { toast } from "react-toastify"; // Import toast
import ProfileWrapper from "../common/ProfileWrapper";

// Define ProfileSectionProps if not already defined elsewhere
interface ProfileSectionProps {
  userData: FullUserData | null;
  isEditable: boolean;
}

// Default Avatar Placeholder (adjust path if needed)
const defaultAvatar = "/default-avatar.png";

const ProfileHeaderSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial data setup
  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setAvatarPreview(userData.profile?.profile_picture_url || defaultAvatar);
    }
  }, [userData]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    // Reset state to original userData values
    if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setAvatarPreview(userData.profile?.profile_picture_url || defaultAvatar);
    }
    setAvatarFile(null); // Clear selected file
    setIsEditing(false);
    setError(null);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (optional)
      if (file.size > 2 * 1024 * 1024) {
        // Max 2MB example
        setError("Файл слишком большой (макс 2MB)");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSaveClick = async () => {
    if (!userData) return;
    setIsLoading(true);
    setError(null);

    try {
      let updatedUserData: FullUserData | null = null;

      // 1. Update Base Profile (Name)
      const baseDataChanged =
        firstName !== userData.first_name || lastName !== userData.last_name;
      if (baseDataChanged) {
        updatedUserData = await updateBaseProfile({
          first_name: firstName,
          last_name: lastName,
        });
        // Immediately update local state if only name changed before picture upload attempt
        if (updatedUserData && !avatarFile) {
          updateUserState(updatedUserData);
        }
        toast.success("Имя обновлено!");
      }

      // 2. Update Profile Picture if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("profile_picture", avatarFile);
        // Pass the latest userData (possibly updated by name change) or the original
        const pictureUpdateResult = await updateProfilePicture(formData);
        updatedUserData = pictureUpdateResult; // This response contains the *final* user state
        toast.success("Фото профиля обновлено!");
      }

      // Update global state with the final user data if any update occurred
      if (updatedUserData) {
        updateUserState(updatedUserData);
      }

      setIsEditing(false);
      setAvatarFile(null); // Clear file after successful upload
    } catch (err: unknown) {
      console.error("Error saving header:", err);
      const errMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ||
        (err as Error)?.message ||
        "Не удалось сохранить изменения.";
      setError(errMsg);
      toast.error(`Ошибка: ${errMsg}`); // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const currentAvatar = avatarPreview || defaultAvatar;
  const displayName = isEditing
    ? `${firstName} ${lastName}`
    : `${userData?.first_name || ""} ${userData?.last_name || ""}`;

  return (
    <ProfileWrapper
      title="Профиль"
      isEditable={isEditable}
      isEditing={isEditing}
      onEditClick={handleEditClick}
    >
      <div className="flex flex-col items-center">
        {/* Avatar Display/Edit */}
        <div className="relative mb-4">
          <img
            src={currentAvatar}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultAvatar;
            }} // Fallback if src is invalid
          />
          {isEditable && isEditing && (
            <>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden" // Hide the default input
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition duration-150 shadow-md"
                aria-label="Изменить фото профиля"
                disabled={isLoading}
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Name Display/Edit */}
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mb-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Имя"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={isLoading}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Фамилия"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={isLoading}
            />
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {displayName || "Имя не указано"}
          </h2>
        )}

        {/* Role/Status (Read Only) */}
        <p className="text-gray-600 text-sm">
          {userData?.profile?.role || ""}
          {userData?.profile?.role === "THERAPIST" &&
            userData.therapist_profile?.is_verified && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Верифицирован
              </span>
            )}
        </p>

        {/* Edit Controls */}
        {isEditable && isEditing && (
          <div className="w-full max-w-md mt-4">
            {error && <ErrorMessage message={error} />}
            <EditControls
              isLoading={isLoading}
              onCancel={handleCancelClick}
              onSave={handleSaveClick}
            />
          </div>
        )}
      </div>
    </ProfileWrapper>
  );
};

export default ProfileHeaderSection;
