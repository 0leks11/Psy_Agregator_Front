// src/components/messaging/ChatHeader.tsx
import React from "react";
import { BasicUserInfo } from "../../types/messaging";

interface ChatHeaderProps {
  interlocutor: BasicUserInfo;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ interlocutor, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <img
          src={interlocutor.avatarUrl || "/default-avatar.png"}
          alt={interlocutor.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-medium text-gray-900">{interlocutor.name}</h3>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-gray-500 hover:text-gray-700"
      >
        Назад к списку чатов
      </button>
    </div>
  );
};

export default ChatHeader;
