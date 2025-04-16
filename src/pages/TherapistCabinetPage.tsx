import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FullUserData } from "../types/user";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TherapistCabinetPage: React.FC = () => {
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
      <div className="text-center py-8">
        <p className="text-red-600">
          Пожалуйста, войдите в систему для просмотра личного кабинета.
        </p>
      </div>
    );
  }

  const isVerified = typedUser.therapist_profile?.is_verified ?? false;
  const isSubscribed = typedUser.therapist_profile?.is_subscribed ?? false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Личный кабинет специалиста
      </h1>

      {/* Профиль и статус */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <img
            src={
              typedUser.profile?.profile_picture_url || "/default-avatar.png"
            }
            alt={`${typedUser.first_name} ${typedUser.last_name}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Добро пожаловать, {typedUser.first_name} {typedUser.last_name}!
            </h2>
            <p className="text-gray-500">{typedUser.email}</p>
          </div>
        </div>

        {/* Статусы */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Статус верификации
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {isVerified ? "Верифицирован" : "На проверке"}
              </span>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Статус подписки
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isSubscribed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isSubscribed ? "Активна" : "Неактивна"}
              </span>
            </div>
            {!isSubscribed && (
              <p className="text-xs text-red-600 mt-2">
                Ваш профиль не виден клиентам. Активируйте подписку для начала
                работы.
              </p>
            )}
          </div>
        </div>

        {/* Информация о профиле */}
        <div className="space-y-4">
          {typedUser.profile?.gender_code &&
            typedUser.profile.gender_code !== "UNKNOWN" && (
              <div className="flex items-center">
                <span className="text-gray-600 w-24">Пол:</span>
                <span className="text-gray-800">
                  {typedUser.profile.gender}
                </span>
              </div>
            )}

          {typedUser.therapist_profile?.about && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                О себе
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {typedUser.therapist_profile.about}
              </p>
            </div>
          )}

          {typedUser.therapist_profile?.skills &&
            typedUser.therapist_profile.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Навыки и специализация
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

          {typedUser.therapist_profile?.languages &&
            typedUser.therapist_profile.languages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Языки
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typedUser.therapist_profile.languages.map((lang) => (
                    <span
                      key={lang.id}
                      className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Быстрые действия
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/profile/edit"
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-blue-600">Редактировать профиль</span>
          </Link>
          <Link
            to="/subscription"
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-blue-600">Управление подпиской</span>
          </Link>
          <Link
            to="/appointments"
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-blue-600">Мои записи</span>
          </Link>
          <Link
            to="/statistics"
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-blue-600">Статистика</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TherapistCabinetPage;
