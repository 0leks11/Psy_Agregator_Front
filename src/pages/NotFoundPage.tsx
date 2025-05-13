// src/pages/NotFoundPage.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Используем Link для HomePage
import {
  ArrowUturnLeftIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

// Определяем возможные контексты для страницы 404
type NotFoundContextType = "public" | "authenticated";

interface NotFoundPageProps {
  contextType?: NotFoundContextType; // Контекст, в котором отображается страница
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
  contextType = "public",
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Возвращает на предыдущую страницу в истории браузера
  };

  // Определяем кнопки в зависимости от контекста
  let primaryActionPath = "/";
  let primaryActionText = "Вернуться на главную";

  if (contextType === "authenticated") {
    primaryActionPath = "/my-profile"; // Для залогиненных - в кабинет
    primaryActionText = "В мой кабинет";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 text-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full">
        <svg
          className="mx-auto h-20 w-20 text-sky-400 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 14a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          />
        </svg>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-800 mb-3">
          404
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-slate-700 mb-4">
          Ой! Страница не найдена.
        </p>
        <p className="text-slate-500 mb-8">
          Кажется, вы пошли не той тропой. Запрошенная страница не существует
          или была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150"
          >
            <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
            Назад
          </button>

          <Link
            to={primaryActionPath}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150"
          >
            {contextType === "authenticated" ? (
              <UserCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <HomeIcon className="h-5 w-5 mr-2" />
            )}
            {primaryActionText}
          </Link>

          {/* Дополнительная кнопка "На главную" для аутентифицированных пользователей */}
          {contextType === "authenticated" && (
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 mt-2 sm:mt-0"
              title="Вернуться на общую главную страницу"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              На главную (сайт)
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
