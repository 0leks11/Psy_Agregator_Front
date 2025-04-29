import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicUserProfile } from "../../services/profileService";
import { PublicProfileData } from "../../types/api";
import { FullUserData } from "../../types/types";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

// Импортируем компоненты секций
import ProfileHeaderSection from "../../components/profileSections/identity/ProfileHeaderSection";
import ProfileAboutSection from "../../components/profileSections/content/ProfileAboutSection";
import ProfileSkillsSection from "../../components/profileSections/tags/ProfileSkillsSection";
import ProfileLanguagesSection from "../../components/profileSections/tags/ProfileLanguagesSection";
import ProfileStatusSection from "../../components/profileSections/details/ProfileSubscriptionStatusSection";
import ProfileVideoSection from "../../components/profileSections/content/ProfileVideoSection";
import ProfilePublicationsSection from "../../components/profileSections/publications/ProfilePublicationsSection";
import ProfilePhotoGalleryViewSection from "../../components/profileSections/gallery/ProfilePhotoGallerySection";

const UserProfilePage: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const [profileData, setProfileData] = useState<PublicProfileData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!publicId) {
        setError("ID профиля не указан.");
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
  const userDataForSections: FullUserData = {
    id: 0,
    public_id: profileData.public_id,
    first_name: profileData.first_name || "",
    last_name: profileData.last_name || "",
    email: "",
    role: "THERAPIST",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile: {
      role: "THERAPIST",
      gender: "UNKNOWN",
      gender_code: "UNKNOWN",
      gender_display: "",
      profile_picture_url: profileData.profile_picture_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: 0,
    },
    therapist_profile: {
      id: 0,
      user_profile: 0,
      about: profileData.about || "",
      experience_years: profileData.experience_years || 0,
      skills: profileData.skills.map((s) => s.name),
      languages: profileData.languages.map((l) => l.name),
      total_hours_worked: null,
      display_hours: false,
      office_location: "",
      video_intro_url: profileData.short_video_url,
      website_url: "",
      linkedin_url: "",
      photos: profileData.photos.map((url) => ({
        id: 0,
        therapist_profile: 0,
        image: url,
        caption: "",
        order: 0,
      })),
      is_verified: profileData.is_verified || false,
      is_subscribed: profileData.is_subscribed || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "",
      status_display: "",
    },
    client_profile: null,
  };

  // Преобразуем публикации в формат Publication
  const publicationsForSection = profileData.publications.map((pub) => ({
    id: pub.id,
    title: pub.title || "",
    content: "", // В публичном API не передаем полный контент
    created_at: pub.created_at,
    author: userDataForSections,
    is_published: true, // Публичные публикации всегда опубликованы
  }));

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
          <ProfilePublicationsSection
            userData={userDataForSections}
            isEditable={false}
            initialPublications={publicationsForSection}
          />
        )}

        {profileData.photos && profileData.photos.length > 0 && (
          <ProfilePhotoGalleryViewSection
            photos={userDataForSections.therapist_profile?.photos || []}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
