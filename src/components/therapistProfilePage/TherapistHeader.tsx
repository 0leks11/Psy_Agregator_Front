import React from "react";
import { TherapistPublicProfileData } from "../../types/models";
import { CheckBadgeIcon } from "@heroicons/react/24/solid"; // Пример иконки верификации

interface Props {
  therapist: TherapistPublicProfileData;
}

const defaultAvatar = "/default-avatar.png";

const TherapistHeader: React.FC<Props> = ({ therapist }) => {
  const { user, profile, experience_years, office_location, is_verified } =
    therapist;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm mb-8">
      <img
        src={profile.profile_picture_url || defaultAvatar}
        alt={`${user.first_name || ""} ${user.last_name || ""}`}
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
        onError={(e) => (e.currentTarget.src = defaultAvatar)}
      />
      <div className="text-center sm:text-left flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center sm:justify-start">
          {user.first_name || "Имя"} {user.last_name || "Фамилия"}
          {is_verified && (
            <CheckBadgeIcon
              className="w-6 h-6 text-blue-600 ml-2"
              title="Проверенный специалист"
            />
          )}
        </h1>
        <p className="text-lg text-indigo-700 font-medium mb-2">
          Опыт: {experience_years}{" "}
          {experience_years === 1
            ? "год"
            : experience_years > 1 && experience_years < 5
            ? "года"
            : "лет"}
        </p>
        {office_location && (
          <p className="text-md text-gray-600 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 inline-block mr-1 align-text-bottom"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.842 11.842 0 00.757.433.62.62 0 00.28.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                clipRule="evenodd"
              />
            </svg>
            {office_location}
          </p>
        )}
        {/* Кнопки действий (позже) */}
        {/* <div className="mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Написать сообщение</button>
             <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">В избранное</button>
        </div> */}
      </div>
    </div>
  );
};

export default TherapistHeader;
