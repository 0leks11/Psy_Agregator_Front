// src/contexts/ChatContext.tsx
import React, { useState, ReactNode, useEffect } from "react";
import { websocketService } from "../services/websocketService";
import { useAuth } from "./AuthContext";
import api from "../services/api";
import { Message, Conversation } from "../types/messaging";
import { ChatContextType } from "../hooks/useChat";
import { ChatContext } from "./chatContextDefinition";

// Типы для WebSocket сообщений
export interface WebSocketMessage {
  type: "message" | "conversation_update";
  message?: Message;
  conversation?: Conversation;
}

export interface WebSocketOutgoingMessage {
  type: "message";
  conversation_id: string | number;
  text: string;
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    if (token) {
      websocketService.connect(token);

      const handleMessage = (data: WebSocketMessage) => {
        if (data.type === "message" && data.message) {
          setCurrentMessages((prev) => [...prev, data.message!]);
        } else if (data.type === "conversation_update") {
          fetchConversations();
        }
      };

      websocketService.addMessageHandler(handleMessage);

      return () => {
        websocketService.removeMessageHandler(handleMessage);
        websocketService.disconnect();
      };
    }
  }, [token]);

  const fetchConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const response = await api.get("/api/chat/conversations/");
      setConversations(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке диалогов:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string | number) => {
    setIsLoadingMessages(true);
    try {
      const response = await api.get(
        `/api/chat/conversations/${conversationId}/messages/`
      );
      setCurrentMessages(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке сообщений:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (conversationId: string | number, text: string) => {
    try {
      const message: WebSocketOutgoingMessage = {
        type: "message",
        conversation_id: conversationId,
        text: text,
      };
      websocketService.sendMessage(message);
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      throw error;
    }
  };

  const initiateChat = async (
    targetUserId: string | number
  ): Promise<string | number | null> => {
    try {
      const response = await api.post("/api/chat/conversations/", {
        target_user_id: targetUserId,
      });
      const conversationId = response.data.id;
      await fetchConversations();
      return conversationId;
    } catch (error) {
      console.error("Ошибка при создании диалога:", error);
      return null;
    }
  };

  const value: ChatContextType = {
    conversations,
    currentMessages,
    isLoadingConversations,
    isLoadingMessages,
    activeConversationId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setActiveConversationId,
    initiateChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
