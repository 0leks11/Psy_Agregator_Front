import React from "react";

interface ChatListItemProps {
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  avatarUrl,
  name,
  lastMessage,
  lastMessageTime,
  unreadCount,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center p-4 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-200"
    >
      <div className="flex-shrink-0 mr-3">
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900 truncate">{name}</h4>
          {lastMessageTime && (
            <span className="text-xs text-gray-500 ml-2">
              {lastMessageTime}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 truncate flex-grow">
            {lastMessage}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatListItem;
