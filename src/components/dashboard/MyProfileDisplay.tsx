import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import { FullUserData } from "../../types/user";

const MyProfileDisplay: React.FC = () => {
  const { user, loading } = useAuth();
  const typedUser = user as FullUserData | null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!typedUser) {
    return (
      <ErrorMessage message="Не удалось загрузить данные профиля. Попробуйте войти снова." />
    );
  }

  const isTherapist = typedUser.profile?.role === "THERAPIST";
  const isClient = typedUser.profile?.role === "CLIENT";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Мой профиль</h1>

      {/* --- Отображение для Терапевта --- */}
      {isTherapist && typedUser.therapist_profile && (
        <>
          {/* Основная информация */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-6">
              <img
                src={
                  typedUser.profile?.profile_picture_url ||
                  "/default-avatar.png"
                }
                alt={`${typedUser.first_name} ${typedUser.last_name}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  {typedUser.first_name} {typedUser.last_name}
                </h2>
                <p className="text-gray-500">{typedUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              {typedUser.therapist_profile.about && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    О себе
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {typedUser.therapist_profile.about}
                  </p>
                </div>
              )}

              {typedUser.therapist_profile.experience_years && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Опыт:</span>
                  <span className="text-gray-800">
                    {typedUser.therapist_profile.experience_years} лет
                  </span>
                </div>
              )}

              {typedUser.therapist_profile.office_location && (
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Формат:</span>
                  <span className="text-gray-800">
                    {typedUser.therapist_profile.office_location}
                  </span>
                </div>
              )}

              {typedUser.therapist_profile.skills &&
                typedUser.therapist_profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Навыки
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {typedUser.therapist_profile.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {typedUser.therapist_profile.languages &&
                typedUser.therapist_profile.languages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Языки
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {typedUser.therapist_profile.languages.map((language) => (
                        <span
                          key={language.id}
                          className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {language.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Статусы */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                <p>
                  Статус верификации:{" "}
                  {typedUser.therapist_profile.is_verified
                    ? "Подтвержден"
                    : "На проверке"}
                </p>
                <p>
                  Статус подписки:{" "}
                  {typedUser.therapist_profile.is_subscribed
                    ? "Активна"
                    : "Неактивна"}
                </p>
                {typedUser.therapist_profile.total_hours_worked !== null && (
                  <p>
                    Всего часов практики:{" "}
                    {typedUser.therapist_profile.total_hours_worked}{" "}
                    (Отображается:{" "}
                    {typedUser.therapist_profile.display_hours ? "Да" : "Нет"})
                  </p>
                )}
              </div>

              {/* Социальные сети */}
              {(typedUser.therapist_profile.website_url ||
                typedUser.therapist_profile.linkedin_url) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Ссылки
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {typedUser.therapist_profile.website_url && (
                      <a
                        href={typedUser.therapist_profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Сайт
                      </a>
                    )}
                    {typedUser.therapist_profile.linkedin_url && (
                      <a
                        href={typedUser.therapist_profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* --- Отображение для Клиента --- */}
      {isClient && typedUser.client_profile && (
        <>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-6">
              <img
                src={
                  typedUser.profile?.profile_picture_url ||
                  "/default-avatar.png"
                }
                alt={`${typedUser.first_name} ${typedUser.last_name}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  {typedUser.first_name} {typedUser.last_name}
                </h2>
                <p className="text-gray-500">{typedUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              {typedUser.profile?.gender_code &&
                typedUser.profile.gender_code !== "UNKNOWN" && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Пол:</span>
                    <span className="text-gray-800">
                      {typedUser.profile.gender_display}
                    </span>
                  </div>
                )}

              {typedUser.client_profile.request_details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Ваш запрос
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {typedUser.client_profile.request_details}
                  </p>
                </div>
              )}

              {typedUser.client_profile.interested_topics &&
                typedUser.client_profile.interested_topics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Интересующие темы
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {typedUser.client_profile.interested_topics.map(
                        (topic) => (
                          <span
                            key={topic.id}
                            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {topic.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </>
      )}

      {/* Если профиль не определен */}
      {!isTherapist && !isClient && (
        <ErrorMessage message="Не удалось определить роль пользователя." />
      )}
    </div>
  );
};

export default MyProfileDisplay;
