// src/components/messaging/MessageList.tsx
import React, { useEffect, useRef } from "react";
import { Message } from "../../types/messaging";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string | number;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <p className="text-gray-500 italic">
          Сообщений пока нет. Начните диалог!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-1 bg-white">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} currentUserId={currentUserId} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
