import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicUserProfile } from "../../services/profileService";
import { PublicProfileData } from "../../types/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

// Импортируем компоненты секций
import ProfileHeaderSection from "../../components/profileSections/identity/ProfileHeaderSection";
import ProfileAboutSection from "../../components/profileSections/content/ProfileAboutSection";
import ProfileSkillsSection from "../../components/profileSections/tags/ProfileSkillsSection";
import ProfileLanguagesSection from "../../components/profileSections/tags/ProfileLanguagesSection";
import ProfileStatusSection from "../../components/profileSections/details/ProfileSubscriptionStatusSection";
import ProfileVideoSection from "../../components/profileSections/content/ProfileVideoSection";
import ProfilePublicationsListSection from "../../components/profileSections/publications/ProfilePublicationsSection";
import ProfilePhotoGalleryViewSection from "../../components/profileSections/gallery/ProfilePhotoGallerySection";

const UserProfilePage: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  console.log("UserProfilePage - Extracted publicId:", publicId);
  const [profileData, setProfileData] = useState<PublicProfileData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicId) {
        setError("ID профиля не указан.");
        console.error("UserProfilePage - publicId is missing!");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log(
          "UserProfilePage - Attempting to fetch profile for ID:",
          publicId
        );
        const data = await getPublicUserProfile(publicId);
        console.log("UserProfilePage - Fetched profile data:", data);
        setProfileData(data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        if (err instanceof Error) {
          if (err.message.includes("404") || err.message.includes("403")) {
            setError("Профиль не найден или недоступен.");
          } else {
            setError("Не удалось загрузить профиль.");
          }
        } else {
          setError("Не удалось загрузить профиль.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [publicId]);

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

  // Создаем адаптированные данные для совместимости с компонентами
  const userDataForSections = {
    id: 0,
    public_id: profileData.public_id,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email: "",
    profile: {
      role: "THERAPIST" as const,
      gender: "UNKNOWN" as const,
      gender_display: "",
      profile_picture_url: profileData.profile_picture_url,
      pronouns: profileData.pronouns,
    },
    therapist_profile: {
      id: 0,
      about: profileData.about,
      experience_years: 0,
      is_verified: true,
      is_subscribed: true,
      skills: profileData.skills,
      languages: profileData.languages,
      total_hours_worked: null,
      display_hours: false,
      office_location: null,
      status: profileData.status,
      status_display: profileData.status_display,
      short_video_url: profileData.short_video_url,
      photos: profileData.photos.map((url) => ({
        id: 0,
        image: url,
        caption: "",
        order: 0,
      })),
    },
    client_profile: null,
    publications: profileData.publications,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <ProfileHeaderSection
          userData={userDataForSections}
          isEditable={false}
        />
        <ProfileAboutSection
          userData={userDataForSections}
          isEditable={false}
        />
        <ProfileSkillsSection
          userData={userDataForSections}
          isEditable={false}
        />
        <ProfileLanguagesSection
          userData={userDataForSections}
          isEditable={false}
        />
        <ProfileStatusSection
          userData={userDataForSections}
          isEditable={false}
        />

        {profileData.short_video_url && (
          <ProfileVideoSection videoUrl={profileData.short_video_url} />
        )}

        {profileData.publications && profileData.publications.length > 0 && (
          <ProfilePublicationsListSection
            userData={userDataForSections}
            isEditable={false}
          />
        )}

        {profileData.photos && profileData.photos.length > 0 && (
          <ProfilePhotoGalleryViewSection
            userData={userDataForSections}
            isEditable={false}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
