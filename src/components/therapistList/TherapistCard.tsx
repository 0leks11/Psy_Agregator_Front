// src/components/therapistList/TherapistCard.tsx (или где он у вас сейчас)

import React from "react";
import { Link } from "react-router-dom";
import { ApiTherapistListData } from "../../types/api";

interface TherapistCardProps {
  therapist: ApiTherapistListData;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  console.log("Rendering TherapistCard for:", therapist.id);

  const defaultImage = "/default-avatar.png";
  const defaultStatus = "Статус не указан";
  const defaultAbout = "Информация отсутствует";

  // Проверяем наличие необходимых данных
  if (!therapist || !therapist.id) {
    console.warn("Invalid therapist data in TherapistCard:", therapist);
    return null;
  }

  // Безопасное получение данных с использованием опциональной цепочки и значений по умолчанию
  const avatarUrl = therapist?.profile?.profile_picture_url ?? defaultImage;
  const fullName = `${therapist?.first_name ?? ""} ${
    therapist?.last_name ?? ""
  }`.trim();
  const aboutText = therapist?.therapist_profile?.about ?? defaultAbout;
  const skills = therapist?.therapist_profile?.skills ?? [];
  const languages = therapist?.therapist_profile?.languages ?? [];
  const status = therapist?.therapist_profile?.status_display ?? defaultStatus;

  // Определяем навыки для показа
  const skillsToShow = skills?.slice(0, 3) ?? [];
  const remainingSkillsCount = Math.max(
    0,
    (skills?.length ?? 0) - skillsToShow.length
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col w-full max-w-sm bg-white">
      {/* Аватар */}
      <img
        src={avatarUrl}
        alt={fullName || "Аватар терапевта"}
        className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-indigo-100"
        onError={(e) => {
          console.warn(
            `Failed to load image for therapist ${therapist.id}:`,
            avatarUrl
          );
          e.currentTarget.src = defaultImage;
        }}
      />

      {/* Имя и Статус */}
      <h3 className="text-lg font-semibold text-center text-gray-900 mb-1">
        {fullName || "Имя не указано"}
      </h3>
      <p className="text-sm text-gray-500 text-center mb-3">{status}</p>

      {/* Навыки */}
      {skills?.length > 0 && (
        <div className="mb-3 text-center">
          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">
            Специализация:
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {skillsToShow.map((skill) => (
              <span
                key={skill?.id}
                className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium"
              >
                {skill?.name ?? "Неизвестный навык"}
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="text-xs text-indigo-600 font-medium py-0.5">
                +{remainingSkillsCount}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Языки */}
      {languages?.length > 0 && (
        <div className="mb-3 text-center">
          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">
            Языки:
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {languages.map((lang) => (
              <span
                key={lang?.id}
                className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium"
              >
                {lang?.name ?? "Неизвестный язык"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* О себе (сокращенно) */}
      <p className="text-sm text-gray-700 flex-grow mb-4 line-clamp-3 text-center px-2">
        {aboutText}
      </p>

      {/* Кнопка просмотра профиля */}
      <Link
        to={`/users/${therapist?.public_id}`}
        className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 mt-auto"
      >
        Просмотреть профиль
      </Link>
    </div>
  );
};

export default TherapistCard;
