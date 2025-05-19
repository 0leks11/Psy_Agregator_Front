// src/components/messaging/TypingIndicator.tsx
import React from "react";

interface TypingIndicatorProps {
  usersTyping: { name: string }[]; // Массив пользователей, которые печатают
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ usersTyping }) => {
  if (!usersTyping || usersTyping.length === 0) {
    return null;
  }

  const names = usersTyping.map((u) => u.name).join(", ");
  const text =
    usersTyping.length > 1 ? `${names} печатают...` : `${names} печатает...`;

  return (
    <div className="px-4 py-1 text-xs text-gray-500 italic h-6">
      {" "}
      {/* Фиксированная высота, чтобы не прыгало */}
      {text}
    </div>
  );
};

export default TypingIndicator;
