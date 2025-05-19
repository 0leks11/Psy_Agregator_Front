// src/components/sidebar/ChatListPanel.tsx
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUI } from "../../hooks/useUI";
import { useChat } from "../../hooks/useChat";
import ChatList from "../messaging/ChatList";
import { ChatWindow } from "../messaging/ChatWindow";
import { Box, Typography } from "@mui/material";

const ChatListPanel: React.FC = () => {
  const { isChatPanelOpen, toggleChatPanel } = useUI();
  const { activeConversationId } = useChat();

  if (!isChatPanelOpen) {
    return null;
  }

  return (
    // Стили для выезжающей панели (можно улучшить анимацию)
    // Важно: убедитесь, что эта панель имеет более высокий z-index, чем MainSidebar, если они могут перекрываться
    <Box
      className={`fixed inset-y-0 left-0 w-64 bg-slate-50 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-r border-slate-200
                        ${
                          isChatPanelOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }`}
    >
      <Box className="flex justify-between items-center p-4 border-b border-slate-200">
        <Typography variant="h6" className="text-slate-700">
          {activeConversationId ? "Диалог" : "Сообщения"}
        </Typography>
        <button
          onClick={() => toggleChatPanel(false)}
          className="p-1 text-slate-500 hover:text-slate-700"
          aria-label="Закрыть сообщения"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </Box>
      <Box className="flex flex-col h-[calc(100%-57px)]">
        {activeConversationId ? <ChatWindow /> : <ChatList />}
      </Box>
    </Box>
  );
};

export default ChatListPanel;
