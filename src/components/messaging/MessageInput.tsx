// src/components/messaging/MessageInput.tsx
import React from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-end space-x-2">
        <textarea
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          className="flex-grow resize-none rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
          aria-label="Отправить сообщение"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
