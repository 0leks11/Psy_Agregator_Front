import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FullUserData } from "../types/user";
import LoadingSpinner from "../components/common/LoadingSpinner";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const UserCabinetPage: React.FC = () => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Личный кабинет клиента
        </h1>

        {/* Основная информация */}
        <div className="bg-white shadow-lg rounded-lg p-6">
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
                Добро пожаловать, {typedUser.first_name}!
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
                    {typedUser.profile.gender}
                  </span>
                </div>
              )}

            {typedUser.client_profile?.request_details && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Ваш запрос
                </h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {typedUser.client_profile.request_details}
                </p>
              </div>
            )}

            {typedUser.client_profile?.interested_topics &&
              typedUser.client_profile.interested_topics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Интересующие темы
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typedUser.client_profile.interested_topics.map((topic) => (
                      <span
                        key={topic.id}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {topic.name}
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
              to="/therapists"
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-600">Найти специалиста</span>
            </Link>
            <Link
              to="/saved-searches"
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-600">Сохраненные поиски</span>
            </Link>
            <Link
              to="/appointments"
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-600">Мои записи</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserCabinetPage;
