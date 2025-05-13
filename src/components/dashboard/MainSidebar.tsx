import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import SidebarItem from "../sidebar/SidebarItem";
import SidebarSubscriptionItem from "../sidebar/SidebarSubscriptionItem";
import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  ChatBubbleLeftRightIcon, // Убедитесь, что иконка выхода импортирована
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
// ... импорты иконок ...
import { toast } from "react-toastify";

const DEFAULT_AVATAR_PLACEHOLDER = "/default-avatar.png"; // Определяем плейсхолдер

const MainSidebar: React.FC = () => {
  const {
    user, // Получаем весь объект user
    logout,
  } = useAuth();
  const { isSidebarExpanded, toggleSidebar, toggleChatPanel } = useUI();
  const navigate = useNavigate();

  const isTherapist = user?.profile?.role === "THERAPIST";

  const handleLogout = async () => {
    try {
      await logout(); // logout из AuthContext больше не делает navigate
      navigate("/"); // Редирект теперь будет обрабатываться в AppLayout или ProtectedRoute
      toast.info("Вы успешно вышли из системы.");
    } catch (error) {
      toast.error("Ошибка при выходе из системы.");
      console.error("Logout error:", error);
    }
  };

  // Получаем URL аватарки или используем плейсхолдер
  const userAvatarUrl =
    user?.profile?.profile_picture_url || DEFAULT_AVATAR_PLACEHOLDER;

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full
                        ${isSidebarExpanded ? "w-64" : "w-20"}`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isSidebarExpanded && (
          <span className="text-xl font-semibold text-indigo-600">
            PsyAggregator
          </span>
        )}
        <button
          onClick={toggleSidebar} // <--- Используем из контекста
          className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
          aria-label={
            isSidebarExpanded ? "Свернуть сайдбар" : "Развернуть сайдбар"
          }
          title={isSidebarExpanded ? "Свернуть" : "Развернуть"}
        >
          {isSidebarExpanded ? (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronDoubleRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
        <SidebarItem
          to="/my-profile"
          icon={userAvatarUrl} // <--- Передаем URL аватарки
          isAvatar={true} // <--- Указываем, что это аватар (хотя renderIcon уже это определит)
          label={
            user?.first_name ? `Страница ${user.first_name}` : "Моя страница"
          } // Персонализированный label
          isExpanded={isSidebarExpanded}
          title={
            user?.first_name ? `Профиль ${user.first_name}` : "Мой профиль"
          } // Персонализированный title
        />
        <SidebarItem
          to="/therapists"
          icon={MagnifyingGlassIcon}
          label="Найти терапевта"
          isExpanded={isSidebarExpanded}
        />
        {isTherapist && (
          <SidebarSubscriptionItem
            to="/account/subscription"
            icon={CreditCardIcon}
            label="Управление подпиской"
            isExpanded={isSidebarExpanded}
          />
        )}
        <SidebarItem
          icon={ChatBubbleLeftRightIcon}
          label="Сообщения"
          isExpanded={isSidebarExpanded}
          onClick={(e) => {
            e.preventDefault();
            toggleChatPanel(); // <--- Используем из контекста
            // toast.info("Раздел сообщений в разработке!"); // Можно оставить или убрать
          }}
          isButton={true} // Делаем кнопкой, т.к. нет 'to'
        />
      </nav>

      <div className="p-2 border-t border-gray-200">
        <SidebarItem
          icon={ArrowLeftOnRectangleIcon}
          label="Выход"
          isExpanded={isSidebarExpanded}
          onClick={handleLogout}
          isButton={true}
        />
      </div>
    </div>
  );
};

export default MainSidebar;
