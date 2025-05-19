// src/components/messaging/ChatWindow.tsx
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";
import { Conversation } from "../../types/messaging";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import LoadingSpinner from "../common/LoadingSpinner";

export const ChatWindow: React.FC = () => {
  const {
    activeConversationId,
    currentMessages,
    fetchMessages,
    sendMessage,
    isLoadingMessages,
    conversations,
    setActiveConversationId,
  } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (activeConversationId !== null && activeConversationId !== undefined) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  const handleSendMessage = async () => {
    if (
      !newMessage.trim() ||
      activeConversationId === null ||
      activeConversationId === undefined
    )
      return;

    try {
      await sendMessage(activeConversationId, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  if (activeConversationId === null || activeConversationId === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Выберите диалог для начала общения
        </Typography>
      </Box>
    );
  }

  if (isLoadingMessages) {
    return <LoadingSpinner />;
  }

  const activeConversation: Conversation | undefined = conversations.find(
    (conv) => String(conv.id) === String(activeConversationId)
  );

  if (!activeConversation) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1" color="error">
          Диалог не найден
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <ChatHeader
        interlocutor={activeConversation.interlocutor}
        onClose={() => setActiveConversationId(null)}
      />
      <MessageList messages={currentMessages} currentUserId={user?.id} />
      <MessageInput
        value={newMessage}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setNewMessage(e.target.value)
        }
        onSend={handleSendMessage}
        disabled={!newMessage.trim()}
      />
    </Paper>
  );
};
