import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";
import { Paper, Typography, Box } from "@mui/material";
import ChatHeader from "../messaging/ChatHeader";
import MessageList from "../messaging/MessageList";
import MessageInput from "../messaging/MessageInput";
import LoadingSpinner from "../common/LoadingSpinner";

interface ChatWindowProps {
  conversationId: string | number;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onClose }) => {
  const { currentMessages, sendMessage, isLoadingMessages, conversations } =
    useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(conversationId, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  if (isLoadingMessages) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  const activeConversation = conversations.find(
    (conv) => conv.id === conversationId
  );
  if (!activeConversation) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1" color="text.secondary">
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
        onClose={onClose}
      />
      <MessageList messages={currentMessages} currentUserId={user?.id} />
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={handleSendMessage}
        disabled={!newMessage.trim()}
      />
    </Paper>
  );
};

export default ChatWindow;
