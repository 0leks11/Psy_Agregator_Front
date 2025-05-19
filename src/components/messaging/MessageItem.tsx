// src/components/messaging/MessageItem.tsx
import React from "react";
import { Message } from "../../types/messaging";
import { useAuth } from "../../contexts/AuthContext"; // Чтобы определить, чье это сообщение

interface MessageItemProps {
  message: Message;
  currentUserId?: string | number;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
}) => {
  const { user: currentUser } = useAuth();
  const isOwnMessage =
    message.sender.id === currentUserId ||
    currentUser?.id === message.sender.id;

  const formattedTime = new Date(message.timestamp).toLocaleTimeString(
    "ru-RU",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      className={`flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
          isOwnMessage
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Если это не свое сообщение и есть имя отправителя (для групповых чатов в будущем) */}
        {/*!isOwnMessage && message.sender.name && (
                    <p className="text-xs font-semibold mb-1 opacity-70">{message.sender.name}</p>
                )*/}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={`text-xs mt-1 ${
            isOwnMessage
              ? "text-indigo-200 text-right"
              : "text-gray-500 text-left"
          }`}
        >
          {formattedTime}
          {/* TODO: Статус сообщения (галочки) для isOwnMessage */}
          {/* {isOwnMessage && message.status === 'sent' && <CheckIcon className="h-3 w-3 inline ml-1" />} */}
          {/* {isOwnMessage && message.status === 'delivered' && <CheckCheckIcon className="h-3 w-3 inline ml-1" />} */}
          {/* {isOwnMessage && message.status === 'read' && <CheckCheckIcon className="h-3 w-3 inline ml-1 text-blue-400" />} */}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
