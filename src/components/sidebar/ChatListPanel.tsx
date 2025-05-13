// src/components/sidebar/ChatListPanel.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUI } from '../../contexts/UIContext'; // <--- Используем useUI

const ChatListPanel: React.FC = () => {
    const { isChatPanelOpen, toggleChatPanel } = useUI(); // <--- Из UIContext

    if (!isChatPanelOpen) { return null; }

    return (
        // Стили для выезжающей панели (можно улучшить анимацию)
        // Важно: убедитесь, что эта панель имеет более высокий z-index, чем MainSidebar, если они могут перекрываться
        <div className={`fixed inset-y-0 left-0 w-64 bg-slate-50 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-r border-slate-200
                        ${isChatPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700">Сообщения</h3>
                <button
                    onClick={toggleChatPanel} // <--- Используем из контекста
                    className="p-1 text-slate-500 hover:text-slate-700"
                    aria-label="Закрыть сообщения"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="p-4">
                <p className="text-slate-500 italic">Список чатов (в разработке)...</p>
                {/* Здесь будет список ChatListItem */}
            </div>
        </div>
    );
};

export default ChatListPanel;