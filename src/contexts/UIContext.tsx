// src/contexts/UIContext.tsx
import React, {
    createContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
    useContext,
  } from "react";
  import { useLocation } from "react-router-dom"; // UIContext будет ВНУТРИ Router
  
  // Определяем тип для UIContext
  export interface UIContextType {
    isSidebarExpanded: boolean;
    toggleSidebar: () => void;
    isChatPanelOpen: boolean;
    toggleChatPanel: () => void;
    openChatWithUser: (userId: string | number) => void; // Для открытия чата
  }
  
  const UIContext = createContext<UIContextType | undefined>(undefined);
  
  export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
  
    // Состояние для основного сайдбара
    const [isSidebarInitiallyExpanded, setIsSidebarInitiallyExpanded] = useState(true);
    const [isSidebarManuallyExpanded, setIsSidebarManuallyExpanded] = useState<boolean | null>(null);
  
    const isSidebarEffectivelyExpanded = isSidebarManuallyExpanded ?? isSidebarInitiallyExpanded;
  
    const toggleSidebar = useCallback(() => {
      setIsSidebarManuallyExpanded((prev) => !(prev ?? isSidebarInitiallyExpanded));
    }, [isSidebarInitiallyExpanded]);
  
    // Состояние для панели чатов
    const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  
    const toggleChatPanel = useCallback(() => {
      setIsChatPanelOpen((prev) => !prev);
    }, []);
  
    const openChatWithUser = useCallback((userId: string | number) => {
      console.log(`UIContext: Opening chat with user ${userId} (заглушка)`);
      setIsChatPanelOpen(true); // Открываем панель чатов
      // TODO: Добавить логику выбора конкретного чата в панели
    }, []);
  
    // Логика автоматического сворачивания/разворачивания сайдбара
    useEffect(() => {
      const isTherapistListPage = location.pathname === "/therapists";
      if (isTherapistListPage) {
        setIsSidebarInitiallyExpanded(false);
        if (isSidebarManuallyExpanded === null) {
          setIsSidebarManuallyExpanded(false);
        }
      } else {
        setIsSidebarInitiallyExpanded(true);
        if (isSidebarManuallyExpanded === null) {
          setIsSidebarManuallyExpanded(null);
        }
      }
    }, [location.pathname, isSidebarManuallyExpanded]);
  
    const value: UIContextType = {
      isSidebarExpanded: isSidebarEffectivelyExpanded,
      toggleSidebar,
      isChatPanelOpen,
      toggleChatPanel,
      openChatWithUser,
    };
  
    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
  };
  
  export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
      throw new Error("useUI must be used within a UIProvider");
    }
    return context;
  };