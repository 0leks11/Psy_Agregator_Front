import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  BookmarkIcon,
  CreditCardIcon,
  ArrowLeftEndOnRectangleIcon,
  BookOpenIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline"; // Иконки для примера

// Стили для NavLink
const commonLinkClasses =
  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out";
const activeLinkClasses = "bg-blue-100 text-blue-700";
const inactiveLinkClasses =
  "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const isTherapist = user?.profile?.role === "THERAPIST";
  const isClient = user?.profile?.role === "CLIENT";

  const handleLogout = async () => {
    await logout();
    // Редирект не нужен, ProtectedRoute обработает
  };

  return (
    <nav className="space-y-1 bg-white p-4 rounded-lg shadow-md h-full">
      {/* Базовые ссылки для всех */}
      <NavLink
        to="/profile/edit" // Всегда ведет на страницу редактирования
        className={({ isActive }) =>
          `${commonLinkClasses} ${
            isActive ? activeLinkClasses : inactiveLinkClasses
          }`
        }
      >
        <PencilSquareIcon className="h-5 w-5 mr-3 flex-shrink-0" />
        Редактировать профиль
      </NavLink>

      {/* Ссылки для Клиента */}
      {isClient && (
        <>
          <NavLink
            to="/therapists" // Поиск
            className={({ isActive }) =>
              `${commonLinkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              }`
            }
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            Найти специалиста
          </NavLink>
          <NavLink
            to="/my-appointments" // TODO: Будущая страница записей
            className={({ isActive }) =>
              `${commonLinkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              } text-gray-400 cursor-not-allowed`
            } // Пример неактивной ссылки
            onClick={(e) => e.preventDefault()} // Запрещаем переход
          >
            <CalendarDaysIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            Мои записи (скоро)
          </NavLink>
          <NavLink
            to="/saved-searches" // TODO: Будущая страница
            className={({ isActive }) =>
              `${commonLinkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              } text-gray-400 cursor-not-allowed`
            }
            onClick={(e) => e.preventDefault()}
          >
            <BookmarkIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            Избранное (скоро)
          </NavLink>
        </>
      )}

      {/* Ссылки для Терапевта */}
      {isTherapist && (
        <>
          <NavLink
            to="/subscription"
            className={({ isActive }) =>
              `${commonLinkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              }`
            }
          >
            <CreditCardIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            Управление подпиской
          </NavLink>
          <NavLink
            to="/my-publications" // TODO: Будущая страница управления публикациями (или встроить в редактирование)
            className={({ isActive }) =>
              `${commonLinkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              } text-gray-400 cursor-not-allowed`
            }
            onClick={(e) => e.preventDefault()}
          >
            <BookOpenIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            Мои публикации (скоро)
          </NavLink>
          <NavLink
            to="/my-gallery" // TODO: Будущая страница управления галереей (или встроить в редактирование)
            className={({ isActive }) =>
              `${commonLinkClasses} ${
                isActive ? activeLinkClasses : inactiveLinkClasses
              } text-gray-400 cursor-not-allowed`
            }
            onClick={(e) => e.preventDefault()}
          >
            <PhotoIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            Моя галерея (скоро)
          </NavLink>
          {/* Добавить ссылку на просмотр своего публичного профиля? */}
          {/* <NavLink to={`/therapist/${user?.therapist_profile?.id}`} ... >Мой публичный профиль</NavLink> */}
        </>
      )}

      {/* Выход */}
      <button
        onClick={handleLogout}
        className={`${commonLinkClasses} ${inactiveLinkClasses} w-full text-left`}
      >
        <ArrowLeftEndOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
        Выход
      </button>
    </nav>
  );
};

export default DashboardSidebar;
