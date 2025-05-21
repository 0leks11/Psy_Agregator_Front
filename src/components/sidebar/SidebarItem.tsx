// src/components/sidebar/SidebarItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarItemProps } from "../../types/sidebar"; // Используем обновленный тип
import { API_URL, DEFAULT_AVATAR_URL } from "../../constants";

// Дефолтный URL аватара, собранный из констант
const BACKEND_DEFAULT_AVATAR_URL = `${API_URL}${DEFAULT_AVATAR_URL}`;

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  isExpanded,
  onClick,
  isButton = false,
  className = "",
  activeClassName = "bg-indigo-100 text-indigo-700 font-semibold",
  inactiveClassName = "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  title, // Для всплывающей подсказки
  isAvatar = false, // Новый пропс
}) => {
  const commonClasses =
    "flex items-center p-3 rounded-lg transition-colors duration-150 ease-in-out w-full text-left";

  const renderIcon = () => {
    if (isAvatar && typeof icon === "string") {
      // Случай 1: isAvatar=true, icon - это URL аватара
      return (
        <img
          src={icon || BACKEND_DEFAULT_AVATAR_URL} // Используем URL или дефолт с бэкенда
          alt={label}
          className={`flex-shrink-0 object-cover rounded-full ${
            isExpanded ? "w-12 h-12 mr-2.5" : "w-12 h-12 mx-auto" // Размеры для аватара
          }`}
          onError={(e) => (e.currentTarget.src = BACKEND_DEFAULT_AVATAR_URL)}
        />
      );
    } else if (typeof icon === "string") {
      // Случай 2: isAvatar=false (или не указан), icon - это URL обычной иконки
      return (
        <img
          src={icon} // Плейсхолдер здесь может быть не нужен, если это обычная иконка
          alt={label}
          className={`flex-shrink-0 ${
            // Стандартные размеры для не-аватарных иконок-картинок
            isExpanded ? "h-6 w-6 mr-3" : "h-6 w-6 mx-auto"
          }`}
        />
      );
    } else {
      // Случай 3: icon - это React-компонент (например, Heroicon)
      const IconComponent = icon;
      return (
        <IconComponent
          className={`flex-shrink-0 ${
            isExpanded ? "h-6 w-6 mr-3" : "h-6 w-6 mx-auto"
          }`}
          aria-hidden="true"
        />
      );
    }
  };

  const content = (
    <>
      {renderIcon()}
      {isExpanded && <span className="truncate">{label}</span>}
    </>
  );

  // Используем title из пропсов, если он передан, иначе формируем из label для свернутого состояния
  const effectiveTitle = title || (!isExpanded ? label : undefined);

  if (isButton || !to) {
    return (
      <button
        onClick={onClick}
        className={`${commonClasses} ${inactiveClassName} ${className}`}
        title={effectiveTitle}
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${commonClasses} ${
          isActive ? activeClassName : inactiveClassName
        } ${className}`
      }
      title={effectiveTitle}
    >
      {content}
    </NavLink>
  );
};

export default SidebarItem;
