// src/pages/account/MyProfilePage.tsx

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

// Импорты всех секций
import ProfileHeaderSection from "../../components/profileSections/identity/ProfileHeaderSection";
import ProfileGenderSection from "../../components/profileSections/identity/ProfileGenderSection";
import ProfileAboutSection from "../../components/profileSections/content/ProfileAboutSection";
import ProfileVideoSection from "../../components/profileSections/content/ProfileVideoSection";
import ProfileExperienceHoursSection from "../../components/profileSections/details/ProfileExperienceHoursSection";
import ProfileSocialLinksSection from "../../components/profileSections/details/ProfileSocialLinksSection";
import ProfileSubscriptionStatusSection from "../../components/profileSections/details/ProfileSubscriptionStatusSection";
import ProfileSkillsSection from "../../components/profileSections/tags/ProfileSkillsSection";
import ProfileLanguagesSection from "../../components/profileSections/tags/ProfileLanguagesSection";
import ProfilePhotoGallerySection from "../../components/profileSections/gallery/ProfilePhotoGallerySection";
import ProfilePublicationsSection from "../../components/profileSections/publications/ProfilePublicationsSection";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import DashboardLayout from "../../components/dashboard/DashboardLayout"; // Если используете

const MyProfilePage: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ErrorMessage message="Не удалось загрузить данные профиля. Пожалуйста, войдите снова." />
        <Link
          to="/login"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Войти
        </Link>
      </div>
    );
  }

  // --- ИСПРАВЛЕНИЕ И ДИАГНОСТИКА РОЛИ ---
  // 1. Получаем роль и приводим к ВЕРХНЕМУ регистру для сравнения
  const userRoleFromProfile = user.profile?.role?.toUpperCase();
  // 2. Сравниваем с константами в ВЕРХНЕМ регистре
  const isTherapist = userRoleFromProfile === "THERAPIST";
  const isClient = userRoleFromProfile === "CLIENT";

  // 3. Выводим в консоль для проверки (можно удалить после подтверждения)
  console.log("--- MyProfilePage Role Identification ---");
  console.log("Raw role from user.profile.role:", user.profile?.role);
  console.log("Processed role (uppercase):", userRoleFromProfile);
  console.log("isTherapist check result:", isTherapist);
  console.log("isClient check result:", isClient);
  console.log("--------------------------------------");
  // --- КОНЕЦ ИСПРАВЛЕНИЯ И ДИАГНОСТИКИ ---

  // Убираем enhancedUser, передаем просто user
  // const enhancedUser = { ... };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Контейнер для секций профиля */}
        <div className="space-y-6 md:space-y-8">
          {/* --- ОБЩИЕ СЕКЦИИ (для всех ролей) --- */}
          {/* Передаем оригинальный user */}
          <ProfileHeaderSection userData={user} isEditable={true} />
          <ProfileGenderSection userData={user} isEditable={true} />
          <ProfileAboutSection userData={user} isEditable={true} />
          <ProfileSocialLinksSection userData={user} isEditable={true} />
          <ProfileSkillsSection userData={user} isEditable={true} />
          <ProfileLanguagesSection userData={user} isEditable={true} />
          <ProfileExperienceHoursSection userData={user} isEditable={true} />
          <ProfileVideoSection userData={user} isEditable={true} />
          <ProfilePhotoGallerySection userData={user} isEditable={true} />
          <ProfileLanguagesSection userData={user} isEditable={true} />
          <ProfileVideoSection userData={user} isEditable={true} />
          <ProfilePhotoGallerySection userData={user} isEditable={true} />
          <ProfileSubscriptionStatusSection
            userData={user}
            isEditable={false}
          />
          <ProfileExperienceHoursSection userData={user} isEditable={true} />

          {/* УБРАЛИ дубликаты Languages и Publications отсюда */}

          {/* --- СЕКЦИИ, СПЕЦИФИЧНЫЕ ДЛЯ ТЕРАПЕВТА --- */}
          {isTherapist && (
            <>
              {/* Навыки/Специализации (отобразит therapist_profile.skills) */}
              <ProfileSkillsSection userData={user} isEditable={true} />
              {/* Языки */}
              <ProfileLanguagesSection userData={user} isEditable={true} />{" "}
              {/* Оставили здесь */}
              {/* Опыт и Часы */}
              <ProfileExperienceHoursSection
                userData={user}
                isEditable={true}
              />
              {/* Статус подписки */}
              <ProfileSubscriptionStatusSection
                userData={user}
                isEditable={false}
              />
              {/* Видео визитка */}
              <ProfileVideoSection userData={user} isEditable={true} />
              {/* Фотогалерея */}
              <ProfilePhotoGallerySection userData={user} isEditable={true} />
              {/* Публикации */}
              <ProfilePublicationsSection
                userData={user}
                isEditable={true}
              />{" "}
              {/* Оставили здесь */}
            </>
          )}

          {/* --- СЕКЦИИ, СПЕЦИФИЧНЫЕ ДЛЯ КЛИЕНТА --- */}
          {isClient && (
            <>
              {/* Интересующие темы (используем тот же компонент, он отобразит client_profile.interested_topics) */}
              <ProfileSkillsSection userData={user} isEditable={true} />
              {/* Языки для клиента, если нужно? Если нет - убрать */}
              {/* <ProfileLanguagesSection userData={user} isEditable={true} /> */}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProfilePage;
