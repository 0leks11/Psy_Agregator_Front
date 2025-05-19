// src/contexts/UIContext.tsx
import React, { useState, useCallback, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { UIContext } from "./uiContextDefinition";

// Определяем тип для UIContext
export interface UIContextType {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  isChatPanelOpen: boolean;
  toggleChatPanel: (
    forceState?: boolean,
    targetUserId?: string | number
  ) => void;
  openChatWithUser: (userId: string | number) => void;
}

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { initiateChat, setActiveConversationId } = useChat();

  // Состояние для основного сайдбара
  const [isSidebarInitiallyExpanded, setIsSidebarInitiallyExpanded] =
    useState(true);
  const [isSidebarManuallyExpanded, setIsSidebarManuallyExpanded] = useState<
    boolean | null
  >(null);

  const isSidebarEffectivelyExpanded =
    isSidebarManuallyExpanded ?? isSidebarInitiallyExpanded;

  // Состояние для панели чатов
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    const nextManualState = !(
      isSidebarManuallyExpanded ?? isSidebarInitiallyExpanded
    );
    setIsSidebarManuallyExpanded(nextManualState);

    // Если разворачиваем сайдбар и панель чатов открыта, закрываем её
    if (
      (nextManualState === true ||
        (nextManualState === null && isSidebarInitiallyExpanded)) &&
      isChatPanelOpen
    ) {
      setIsChatPanelOpen(false);
      setActiveConversationId(null);
    }
  }, [
    isSidebarInitiallyExpanded,
    isSidebarManuallyExpanded,
    isChatPanelOpen,
    setActiveConversationId,
  ]);

  const toggleChatPanel = useCallback(
    (forceState?: boolean, targetUserId?: string | number) => {
      setIsChatPanelOpen((prevPanelOpen) => {
        const nextPanelState =
          forceState !== undefined ? forceState : !prevPanelOpen;

        if (nextPanelState) {
          // При открытии панели чатов
          setIsSidebarManuallyExpanded(false);
          if (targetUserId) {
            initiateChat(targetUserId).then((chatRoomId) => {
              if (chatRoomId) {
                setActiveConversationId(chatRoomId);
              }
            });
          } else if (!targetUserId && !isChatPanelOpen) {
            setActiveConversationId(null);
          }
        } else {
          // При закрытии панели чатов
          setActiveConversationId(null);
          if (isSidebarManuallyExpanded === false && prevPanelOpen) {
            setIsSidebarManuallyExpanded(null);
          }
        }
        return nextPanelState;
      });
    },
    [
      isSidebarManuallyExpanded,
      setActiveConversationId,
      initiateChat,
      isChatPanelOpen,
    ]
  );

  const openChatWithUser = useCallback(
    async (targetUserId: string | number) => {
      console.log(`UIContext: Открытие чата с пользователем ${targetUserId}`);
      const chatRoomId = await initiateChat(targetUserId);
      if (chatRoomId) {
        setActiveConversationId(chatRoomId);
        setIsChatPanelOpen(true);
        setIsSidebarManuallyExpanded(false);
      } else {
        console.error(
          `UIContext: Не удалось инициировать чат с пользователем ${targetUserId}`
        );
      }
    },
    [initiateChat, setActiveConversationId]
  );

  useEffect(() => {
    const isTherapistListPage = location.pathname === "/therapists";
    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";
    const isHomePage = location.pathname === "/";

    if (isLoginPage || isRegisterPage || (isHomePage && !isChatPanelOpen)) {
      // На публичных страницах сайдбар не нужен
      return;
    }

    if (isTherapistListPage && !isChatPanelOpen) {
      if (isSidebarManuallyExpanded === null) {
        setIsSidebarInitiallyExpanded(false);
      }
    } else {
      if (isSidebarManuallyExpanded === null) {
        setIsSidebarInitiallyExpanded(true);
      }
    }
  }, [location.pathname, isChatPanelOpen, isSidebarManuallyExpanded]);

  const value: UIContextType = {
    isSidebarExpanded: isSidebarEffectivelyExpanded,
    toggleSidebar,
    isChatPanelOpen,
    toggleChatPanel,
    openChatWithUser,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
