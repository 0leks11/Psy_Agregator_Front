import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicTherapistProfile } from "../services/therapistService";
import { TherapistPublicProfileData } from "../types/models";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

// Импортируем компоненты секций
import TherapistHeader from "../components/therapistProfilePage/TherapistHeader";
import TherapistAbout from "../components/therapistProfilePage/TherapistAbout";
import TherapistSkillsLanguages from "../components/therapistProfilePage/TherapistSkillsLanguages";
import TherapistVideoIntro from "../components/therapistProfilePage/TherapistVideoIntro";
import TherapistPhotoGallery from "../components/therapistProfilePage/TherapistPhotoGallery";
import TherapistSocialLinks from "../components/therapistProfilePage/TherapistSocialLinks";
import TherapistPublicationsList from "../components/therapistProfilePage/TherapistPublicationsList";

const PublicTherapistProfilePage: React.FC = () => {
  // Получаем ID профиля терапевта из URL. Убедитесь, что роут настроен на :therapistProfileId
  const { therapistProfileId } = useParams<{ therapistProfileId: string }>();
  const [therapist, setTherapist] = useState<TherapistPublicProfileData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!therapistProfileId) {
        setError("Therapist profile ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const profileId = Number(therapistProfileId);
        if (isNaN(profileId)) {
          throw new Error("Invalid Therapist Profile ID");
        }
        const data = await getPublicTherapistProfile(profileId);
        setTherapist(data);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load therapist profile."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [therapistProfileId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  if (!therapist)
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Профиль терапевта не найден." />
      </div>
    );

  // Собираем страницу из компонентов
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {" "}
      {/* Ограничиваем ширину контента */}
      {/* Шапка */}
      <TherapistHeader therapist={therapist} />
      {/* Основной контент в две колонки на больших экранах */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка (основная информация) */}
        <div className="lg:col-span-2 space-y-8">
          <TherapistAbout about={therapist.about} />
          <TherapistSkillsLanguages
            skills={therapist.skills}
            languages={therapist.languages}
          />
          <TherapistVideoIntro videoUrl={therapist.video_intro_url} />
          <TherapistPhotoGallery photos={therapist.photos} />
          {/* Публикации занимают всю ширину под основной информацией */}
          <div className="lg:hidden">
            {" "}
            {/* Показываем соцсети здесь на малых экранах */}
            <TherapistSocialLinks
              websiteUrl={therapist.website_url}
              linkedinUrl={therapist.linkedin_url}
            />
          </div>
          <TherapistPublicationsList therapistProfileId={therapist.id} />
        </div>

        {/* Правая колонка (сайдбар - соцсети и т.д.) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8">
          <TherapistSocialLinks
            websiteUrl={therapist.website_url}
            linkedinUrl={therapist.linkedin_url}
          />
          {/* Сюда можно добавить блок "Записаться на сессию" или др. информацию */}
        </aside>
      </div>
    </div>
  );
};

export default PublicTherapistProfilePage;
