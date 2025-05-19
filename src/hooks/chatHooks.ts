import { useContext } from "react";
import { Message, Conversation } from "../types/messaging";
import { ChatContext } from "../contexts/chatContextDefinition";

export interface ChatContextType {
  conversations: Conversation[];
  currentMessages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  activeConversationId: string | number | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string | number) => Promise<void>;
  sendMessage: (conversationId: string | number, text: string) => Promise<void>;
  setActiveConversationId: (id: string | number | null) => void;
  initiateChat: (
    targetUserId: string | number
  ) => Promise<string | number | null>;
}

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
