// src/components/sidebar/SidebarSubscriptionItem.tsx
import React, { useState, useEffect } from "react";
import { NavLink, To } from "react-router-dom";
// import SidebarItem from "./SidebarItem"; // SidebarItem больше не используется напрямую для ссылки
import { ForwardRefComponent, SVGProps } from "../../types/sidebar";
// import { getMySubscriptionStatus } from '../../services/paymentService'; // Пример API
// import { SubscriptionStatus } from '../../types'; // Пример типа

interface SidebarSubscriptionItemProps {
  to: To;
  icon: ForwardRefComponent<SVGSVGElement, SVGProps<SVGSVGElement>>;
  label: string;
  isExpanded: boolean;
}

const SidebarSubscriptionItem: React.FC<SidebarSubscriptionItemProps> = ({
  to,
  icon: Icon, // Деструктурируем icon в Icon для рендеринга
  label,
  isExpanded,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      // Загружаем, только если сайдбар развернут, детали должны показываться,
      // информация еще не загружена и не в процессе загрузки
      if (isExpanded && showDetails && !subscriptionInfo && !isLoading) {
        setIsLoading(true);
        try {
          // ЗАГЛУШКА API: Замените на реальный вызов
          // const statusData: SubscriptionStatus = await getMySubscriptionStatus();
          // if (statusData.isActive && statusData.renewalDate) {
          //     setSubscriptionInfo(`Активна до ${new Date(statusData.renewalDate).toLocaleDateString()}`);
          // } else {
          //     setSubscriptionInfo("Подписка неактивна");
          // }
          await new Promise((resolve) => setTimeout(resolve, 700)); // Имитация загрузки
          setSubscriptionInfo("Активна до 31.12.2025 (заглушка)");
        } catch (error) {
          console.error("Error fetching subscription status:", error);
          setSubscriptionInfo("Ошибка загрузки статуса");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSubscriptionData();
  }, [isExpanded, showDetails, subscriptionInfo, isLoading]); // Зависимости для эффекта

  const handleMouseEnter = () => {
    if (isExpanded) {
      // Показываем/запускаем загрузку, только если сайдбар развернут
      setShowDetails(true);
    }
  };

  const handleMouseLeave = () => {
    setShowDetails(false);
    // Не сбрасываем subscriptionInfo, чтобы закэшировать результат, если нужно
  };

  // Классы для NavLink, адаптированные из SidebarItem
  const navLinkActiveClassName = "bg-indigo-100 text-indigo-700 font-semibold";
  const navLinkInactiveClassName =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  const commonNavLinkClasses =
    "flex items-center p-3 rounded-lg transition-colors duration-150 ease-in-out w-full text-left";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative" // Этот div для позиционирования всплывающего окна
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${commonNavLinkClasses} ${
            isActive ? navLinkActiveClassName : navLinkInactiveClassName
          }`
        }
        title={!isExpanded ? label : undefined} // Показываем label в title, если свернуто
      >
        <Icon
          className={`h-6 w-6 flex-shrink-0 ${isExpanded ? "mr-3" : "mx-auto"}`}
        />
        {isExpanded && <span className="truncate">{label}</span>}
      </NavLink>

      {isExpanded && showDetails && subscriptionInfo && (
        <div className="absolute left-full ml-2 top-0 z-20 w-max p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg whitespace-nowrap">
          {isLoading ? "Загрузка..." : subscriptionInfo}
        </div>
      )}
    </div>
  );
};

export default SidebarSubscriptionItem;
