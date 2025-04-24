import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicTherapistProfile } from "../../services/therapistService";
import { TherapistPublicData } from "../../types/types";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

// Импортируем компоненты секций
import ProfileHeaderSection from "../../components/profileSections/identity/ProfileHeaderSection";
import ProfileAboutSection from "../../components/profileSections/content/ProfileAboutSection";
import ProfileSkillsSection from "../../components/profileSections/tags/ProfileSkillsSection";
import ProfileLanguagesSection from "../../components/profileSections/tags/ProfileLanguagesSection";
import ProfileExperienceHoursSection from "../../components/profileSections/details/ProfileExperienceHoursSection";
import ProfileSocialLinksSection from "../../components/profileSections/details/ProfileSocialLinksSection";
import TherapistPhotoGallery from "../../components/profileSections/gallery/ProfilePhotoGallerySection";
import ProfileVideoSection from "../../components/profileSections/content/ProfileVideoSection";

const UserProfilePage: React.FC = () => {
  // Поддерживаем оба параметра: userId и therapistProfileId для обратной совместимости
  const { userId, therapistProfileId } = useParams<{
    userId?: string;
    therapistProfileId?: string;
  }>();
  const [profileData, setProfileData] = useState<TherapistPublicData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Используем userId, если он есть, иначе используем therapistProfileId
      const profileId = userId || therapistProfileId;

      if (!profileId) {
        setError("ID профиля не указан.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const id = parseInt(profileId);
        if (isNaN(id)) {
          throw new Error("Некорректный ID профиля");
        }
        const data = await getPublicTherapistProfile(id);
        setProfileData(data);
      } catch (err: any) {
        console.error("Ошибка при загрузке профиля:", err);
        setError(err.response?.data?.detail || "Не удалось загрузить профиль.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, therapistProfileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Профиль не найден." />
      </div>
    );
  }

  // Преобразуем данные из TherapistPublicData в формат, который ожидают компоненты
  const userData = {
    id: profileData.id,
    first_name: profileData.user.first_name,
    last_name: profileData.user.last_name,
    email: "", // Публичный профиль не содержит email
    profile: profileData.profile,
    therapist_profile: {
      ...profileData,
      user_profile: profileData.profile.id,
    },
    client_profile: null,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Используем те же самые компоненты секций, но с isEditable=false */}
        <ProfileHeaderSection userData={userData} isEditable={false} />

        <ProfileAboutSection userData={userData} isEditable={false} />

        <ProfileSkillsSection userData={userData} isEditable={false} />

        <ProfileLanguagesSection userData={userData} isEditable={false} />

        <ProfileExperienceHoursSection userData={userData} isEditable={false} />

        <ProfileSocialLinksSection userData={userData} isEditable={false} />

        {profileData.photos && profileData.photos.length > 0 && (
          <TherapistPhotoGallery photos={profileData.photos} />
        )}

        {profileData.video_intro_url && (
          <ProfileVideoSection videoUrl={profileData.video_intro_url} />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
