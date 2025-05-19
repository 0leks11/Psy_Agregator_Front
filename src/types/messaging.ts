// src/types/messaging.ts (или где у вас типы)
export interface BasicUserInfo {
  // Для отображения собеседника
  id: string | number;
  name: string;
  avatarUrl?: string | null;
}

export interface Conversation {
  id: string | number; // ID комнаты чата или ID собеседника, если чат 1-на-1
  interlocutor: BasicUserInfo; // Информация о собеседнике
  lastMessage?: {
    text: string;
    timestamp: string; // ISO string date
    isOwnMessage?: boolean; // Если последнее сообщение от текущего пользователя
  } | null;
  unreadCount: number;
}

export interface Message {
  id: string | number;
  chatRoomId: string | number; // К какой комнате относится
  sender: BasicUserInfo; // Кто отправил
  content: string;
  timestamp: string; // ISO string date
  status?: "sent" | "delivered" | "read"; // Статус сообщения
}
