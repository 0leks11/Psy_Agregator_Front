import React, { useEffect } from "react";
import ChatListItem from "./ChatListItem";
import { useChat } from "../../hooks/useChat";
import LoadingSpinner from "../common/LoadingSpinner";

const ChatList: React.FC = () => {
  const {
    conversations,
    fetchConversations,
    isLoadingConversations,
    setActiveConversationId,
  } = useChat();

  useEffect(() => {
    if (conversations.length === 0 && !isLoadingConversations) {
      fetchConversations();
    }
  }, [conversations.length, fetchConversations, isLoadingConversations]);

  if (isLoadingConversations) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map((convo) => (
          <ChatListItem
            key={convo.id}
            avatarUrl={convo.interlocutor.avatarUrl || undefined}
            name={convo.interlocutor.name}
            lastMessage={convo.lastMessage?.text || "Нет сообщений"}
            lastMessageTime={
              convo.lastMessage
                ? new Date(convo.lastMessage.timestamp).toLocaleTimeString(
                    "ru-RU",
                    { hour: "2-digit", minute: "2-digit" }
                  )
                : ""
            }
            unreadCount={convo.unreadCount}
            onClick={() => setActiveConversationId(convo.id)}
          />
        ))
      ) : (
        <p className="p-4 text-center text-gray-500 italic">
          У вас пока нет диалогов.
        </p>
      )}
    </div>
  );
};

export default ChatList;
