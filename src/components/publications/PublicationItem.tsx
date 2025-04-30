// src/components/profileSections/publications/PublicationItem.tsx
import React, { useState, useEffect } from "react";
import { Publication } from "../../types/models";
import {
  TrashIcon,
  EllipsisVerticalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react"; // Для меню "..." (`npm install @headlessui/react`)
import PublicationForm from "./PublicationForm"; // Используем ту же форму для редактирования
import { deletePublication } from "../../services/publicationService"; // API удаления
import ErrorMessage from "../common/ErrorMessage";
import { toast } from "react-toastify";
import ProfileWrapper from "../profileSections/common/ProfileWrapper";
import LoadingSpinner from "../common/LoadingSpinner";

interface PublicationItemProps {
  publication: Publication;
  isEditable: boolean;
  onPostDeleted: (id: number | string) => void; // Функция для удаления из списка в родителе
  onPostUpdated: (updatedPost: Publication) => void; // Функция для обновления в родителе
}

const MAX_COLLAPSED_LINES = 10; // Макс. строк в свернутом виде (примерно)
const LINE_HEIGHT_APPROX = 1.5; // Примерная высота строки в rem или em для расчета max-height

const PublicationItem: React.FC<PublicationItemProps> = ({
  publication,
  isEditable,
  onPostDeleted,
  onPostUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Состояние свернут/развернут
  const [showFullContent, setShowFullContent] = useState(false); // Флаг, нужно ли показывать кнопку "Развернуть"
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("PublicationItem - Received publication:", publication);
    console.log("Publication content:", {
      content: publication.content,
      hasContent: !!publication.content,
      contentLength: publication.content?.length,
    });
  }, [publication]);

  // Определяем, нужно ли показывать кнопку "Развернуть"
  useEffect(() => {
    if (contentRef.current) {
      // Проверяем, превышает ли реальная высота контента высоту свернутого состояния
      const currentHeight = contentRef.current.scrollHeight; // Полная высота
      const collapsedHeight = MAX_COLLAPSED_LINES * LINE_HEIGHT_APPROX * 16; // Примерный расчет в px (16 = базовый размер шрифта)
      setShowFullContent(currentHeight > collapsedHeight + 20); // + небольшой запас
      console.log("Publication content:", {
        content: publication.content,
        currentHeight,
        collapsedHeight,
        showFullContent: currentHeight > collapsedHeight + 20,
      });
    }
    // Мы не сбрасываем isExpanded при изменении publication, чтобы открытый пост оставался открытым
  }, [publication.content]); // Пересчитываем при изменении контента

  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true); // Разворачиваем при редактировании
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Не сбрасываем isExpanded, пусть остается как было до редактирования
  };

  // Обработчик сохранения из формы редактирования
  const handleUpdateSaved = (updatedPost: Publication) => {
    onPostUpdated(updatedPost); // Обновляем в родительском компоненте
    setIsEditing(false); // Выходим из режима редактирования
    // isExpanded остается true
    toast.success("Публикация обновлена!");
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить эту публикацию?")) {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        await deletePublication(publication.id); // Вызываем API
        onPostDeleted(publication.id); // Вызываем колбэк родителя
        // Уведомление об успехе будет в родительском компоненте
      } catch (err: unknown) {
        console.error("Error deleting publication:", err);
        const errMsg =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Не удалось удалить публикацию.";
        setDeleteError(errMsg);
        toast.error(`Ошибка: ${errMsg}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const formattedDate = new Date(publication.created_at).toLocaleDateString(
    "ru-RU",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <ProfileWrapper
      title={publication.title || "Публикация"}
      isEditable={isEditable}
      isEditing={isEditing}
      onEditClick={handleEdit}
    >
      {isEditing ? (
        // --- Режим Редактирования ---
        <PublicationForm
          existingPublication={publication} // Передаем существующие данные
          onPostSaved={handleUpdateSaved} // Обработчик сохранения ИЗМЕНЕНИЙ
          onCancel={handleCancelEdit} // Обработчик отмены
          isEditing={true}
        />
      ) : (
        // --- Режим Отображения ---
        <>
          {/* Заголовок и Дата */}
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-400">{formattedDate}</p>
            {/* Кнопки управления (... меню) убираем кнопку редактирования, т.к. она теперь в ProfileWrapper */}
            {isEditable && (
              <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover/item:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button
                    className="p-1 text-gray-400 hover:text-red-600"
                    aria-label="Опции публикации"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className={`${
                                active
                                  ? "bg-red-500 text-white"
                                  : "text-red-600"
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm disabled:opacity-50`}
                            >
                              {isDeleting ? (
                                <LoadingSpinner />
                              ) : (
                                <TrashIcon className="mr-2 h-5 w-5" />
                              )}
                              Удалить
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>

          {deleteError && <ErrorMessage message={deleteError} />}

          {/* Контент Поста (сворачиваемый) */}
          <div
            ref={contentRef}
            className={`prose prose-sm max-w-none text-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
              !isExpanded ? "max-h-[15rem]" : "max-h-none"
            }`}
          >
            {publication.content ? (
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: publication.content.includes("<")
                    ? publication.content
                    : publication.content
                        .split("\n")
                        .map((line) => `<p>${line}</p>`)
                        .join(""),
                }}
              />
            ) : (
              <p className="text-gray-500 italic">Нет содержания</p>
            )}
          </div>

          {/* Кнопка Развернуть/Свернуть */}
          {showFullContent && (
            <button
              onClick={toggleExpand}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {isExpanded ? (
                <>
                  {" "}
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> Свернуть{" "}
                </>
              ) : (
                <>
                  {" "}
                  <ArrowDownIcon className="h-4 w-4 mr-1" /> Читать полностью{" "}
                </>
              )}
            </button>
          )}
        </>
      )}
    </ProfileWrapper>
  );
};

export default PublicationItem;
