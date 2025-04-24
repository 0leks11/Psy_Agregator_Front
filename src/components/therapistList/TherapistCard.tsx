import React from "react";
import { Link } from "react-router-dom";
import { TherapistProfileReadData } from "../../types/user";

interface TherapistCardProps {
  therapist: TherapistProfileReadData;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  const defaultImage = "/default-avatar.png";

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col w-full max-w-sm bg-white">
      <img
        src={therapist.profile.profile_picture_url || defaultImage}
        alt={`${therapist.user.first_name} ${therapist.user.last_name}`}
        className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-gray-200"
        onError={(e) => (e.currentTarget.src = defaultImage)}
      />
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-1">
        {therapist.user.first_name} {therapist.user.last_name}
      </h3>
      <p className="text-sm text-gray-600 text-center mb-3">
        {therapist.experience_years} лет опыта
      </p>

      {/* Навыки */}
      {therapist.skills && therapist.skills.length > 0 && (
        <div className="mb-3 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">
            Специализация:
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {therapist.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
              >
                {skill.name}
              </span>
            ))}
            {therapist.skills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{therapist.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Языки */}
      {therapist.languages && therapist.languages.length > 0 && (
        <div className="mb-3 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">Языки:</p>
          <div className="flex flex-wrap justify-center gap-1">
            {therapist.languages.map((lang) => (
              <span
                key={lang.id}
                className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
              >
                {lang.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* О себе */}
      <p className="text-sm text-gray-700 flex-grow mb-4 line-clamp-3">
        {therapist.about || "Информация отсутствует."}
      </p>

      {/* Статус верификации */}
      {therapist.is_verified && (
        <div className="flex items-center justify-center mb-3">
          <svg
            className="w-4 h-4 text-green-500 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-green-600">
            Верифицированный специалист
          </span>
        </div>
      )}

      {/* Кнопка просмотра профиля */}
      <Link
        to={`/therapists/${therapist.id}`}
        className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-150 mt-auto"
      >
        Просмотреть профиль
      </Link>
    </div>
  );
};

export default TherapistCard;
