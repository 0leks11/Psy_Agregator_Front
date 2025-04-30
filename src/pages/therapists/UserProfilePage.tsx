import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicUserProfile } from "../../services/profileService";
import { PublicProfileData } from "../../types/api";
import {
  FullUserData,
  Gender,
  UserProfileData,
  TherapistProfilePrivateData,
  TherapistPhotoData,
  Skill,
  Language,
} from "../../types/models";
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
        // Добавляем логирование публикаций
        console.log(
          "UserProfilePage - Publications from API:",
          data.publications
        );
        if (data.publications && data.publications.length > 0) {
          console.log(
            "UserProfilePage - First publication content:",
            data.publications[0].content
          );
        }
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

  // Создаем userDataForSections в соответствии с типами из models.ts
  const userDataForSections: FullUserData = {
    id: 0, // Заглушка
    public_id: profileData.public_id,
    first_name: profileData.first_name || "",
    last_name: profileData.last_name || "",
    email: "", // Нет в public API
    role: "THERAPIST",
    created_at: new Date().toISOString(), // Заглушка, т.к. нет в public API
    updated_at: new Date().toISOString(), // Заглушка
    profile: {
      // Структура UserProfileData из models.ts
      role: "THERAPIST",
      // В PublicProfileData нет gender или gender_display, ставим UNKNOWN
      gender: "UNKNOWN" as Gender,
      gender_display: "Не указано",
      profile_picture_url: profileData.profile_picture_url,
    } as UserProfileData,
    therapist_profile: {
      id: 0, // Заглушка
      about: profileData.about || "",
      experience_years: profileData.experience_years || 0,
      // skills и languages в PublicProfileData - это {id, name}[], что совместимо с Skill[] и Language[]
      skills: profileData.skills.map((s) => ({
        ...s,
        description: null,
      })) as Skill[], // Добавляем description
      languages: profileData.languages.map((l) => ({
        ...l,
        code: null,
      })) as Language[], // Добавляем code
      total_hours_worked: null, // Нет в public API
      display_hours: false, // Нет в public API
      office_location: "", // Нет в public API
      video_intro_url: profileData.short_video_url,
      website_url: null, // Нет в public API
      linkedin_url: null, // Нет в public API
      // Приводим photos: string[] к TherapistPhotoData[]
      photos: profileData.photos.map((url, index) => ({
        id: index, // Заглушка ID
        image: url,
        caption: null,
        order: index,
      })) as TherapistPhotoData[],
      is_verified: profileData.is_verified || false,
      is_subscribed: profileData.is_subscribed || false,
    } as TherapistProfilePrivateData,
    client_profile: undefined,
  };

  // Преобразуем публикации в формат Publication
  const publicationsForSection = profileData.publications.map((pub) => {
    console.log("UserProfilePage - Processing publication:", pub);
    const transformedPub = {
      id: pub.id,
      title: pub.title || "",
      content: pub.content || "", // Используем контент из API, если он есть
      created_at: pub.created_at,
      author: userDataForSections,
      is_published: true, // Публичные публикации всегда опубликованы
    };
    console.log("UserProfilePage - Transformed publication:", transformedPub);
    return transformedPub;
  });

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

        {/* Секция публикаций */}
        {profileData.publications && profileData.publications.length > 0 ? (
          <ProfilePublicationsSection
            userData={userDataForSections}
            isEditable={false}
            initialPublications={publicationsForSection}
          />
        ) : (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Публикации</h3>
            <p className="text-gray-500 italic">Публикаций пока нет.</p>
          </div>
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
