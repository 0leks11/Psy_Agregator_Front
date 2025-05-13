// src/types/sidebar.ts

import React from "react";
import { To } from "react-router-dom";
import { ProfileSectionProps } from "./models"; // Импортируем ProfileSectionProps

// Define and export SVGProps and ForwardRefComponent directly using React's types
export type SVGProps<T extends SVGElement = SVGSVGElement> = React.SVGProps<T>;
export type ForwardRefComponent<
  ElementType, // Represents the type of the element (e.g., SVGSVGElement)
  PropsType // Represents the type of the props for that element
> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<PropsType> & React.RefAttributes<ElementType>
>;

// Типы для основного сайдбара
export interface SidebarContextType {
  isSidebarExpanded: boolean; // Развернут ли основной сайдбар
  toggleSidebar: () => void; // Функция для переключения состояния основного сайдбара
  isChatPanelOpen: boolean; // Открыта ли панель чатов
  toggleChatPanel: () => void; // Функция для переключения состояния панели чатов
  openChatWithUser?: (userId: string | number) => void; // Функция для открытия чата с конкретным пользователем
}

// Пропсы для MainSidebar - теперь не принимает пропсов напрямую
export type MainSidebarProps = Record<string, never>;

// Пропсы для SidebarItem
export interface SidebarItemProps {
  to?: To;
  // 'icon' может быть либо компонентом Heroicon, либо URL-строкой для изображения
  icon: ForwardRefComponent<SVGSVGElement, SVGProps<SVGSVGElement>> | string;
  label: string;
  isExpanded: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
  isButton?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  title?: string;
  isAvatar?: boolean; // Новый флаг, указывающий, что 'icon' - это URL аватара
}

// Пропсы для SidebarSubscriptionItem
export interface SidebarSubscriptionItemProps {
  to: To;
  icon: ForwardRefComponent<SVGSVGElement, SVGProps<SVGSVGElement>>;
  label: string;
  isExpanded: boolean; // Тоже нужно для отображения
}

// Пропсы для ChatListPanel - теперь не принимает пропсов напрямую
export type ChatListPanelProps = Record<string, never>;

// ProfileHeaderSectionCustomProps теперь является псевдонимом для ProfileSectionProps,
// так как на данный момент не добавляет новых свойств.
// Если в будущем появятся специфичные пропсы, можно будет снова сделать его интерфейсом.
export type ProfileHeaderSectionCustomProps = ProfileSectionProps;
