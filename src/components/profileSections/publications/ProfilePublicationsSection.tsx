// src/components/profileSections/publications/ProfilePublicationsSection.tsx
import React, { useState, useEffect } from "react";
import { ProfileSectionProps, User, Publication } from "../../../types/models"; // Добавить тип Publication
import { useAuth } from "../../../contexts/AuthContext";
// Предположим, есть сервис для публикаций:
import {
  getMyPublications,
  addPublication,
  deletePublication,
} from "../../../services/publicationService";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import PublicationItem from "../../publications/PublicationItem"; // Новый компонент для ОДНОГО поста
import PublicationForm from "../../publications/PublicationForm"; // Компонент с формой (переиспользуем или сделаем частью PublicationItem)
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import ProfileWrapper from "../common/ProfileWrapper"; // Используем обертку, но без стандартной кнопки edit
import { toast } from "react-toastify";

const ProfilePublicationsSection: React.FC<ProfileSectionProps> = ({
  userData,
  isEditable,
}) => {
  const { user } = useAuth(); // Нужен для определения, чей профиль смотрим
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Определяем ID пользователя, чьи публикации загружать
  const targetUserId = userData?.id;

  // Загрузка публикаций
  useEffect(() => {
    if (!targetUserId) return; // Не загружать, если нет ID

    const fetchPublications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Нужна функция, которая получает публикации по ID пользователя
        // Возможно, getMyPublications если isEditable, и getPublicationsByUserId если !isEditable
        const fetchedPublications = await getMyPublications(targetUserId); // Уточнить API
        setPublications(fetchedPublications || []);
      } catch (err: any) {
        console.error("Error fetching publications:", err);
        setError("Не удалось загрузить публикации.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [targetUserId]); // Перезагружаем при смене пользователя

  // Обработчик успешного добавления нового поста (вызывается из PublicationForm/PublicationItem)
  const handlePostAdded = (newPost: Publication) => {
    setPublications((prev) => [newPost, ...prev]); // Добавляем новый пост в начало списка
    setShowNewPostForm(false); // Скрываем форму
    toast.success("Публикация добавлена!");
  };

  // Обработчик успешного удаления поста (вызывается из PublicationItem)
  const handlePostDeleted = (deletedPostId: number | string) => {
    setPublications((prev) => prev.filter((post) => post.id !== deletedPostId));
    toast.success("Публикация удалена!");
  };

  // Обработчик успешного обновления поста (вызывается из PublicationItem)
  const handlePostUpdated = (updatedPost: Publication) => {
    setPublications((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    // Уведомление об успехе будет внутри PublicationItem
  };

  // --- Рендеринг ---
  // Используем обертку только для заголовка и кнопки "+"
  return (
    <div className="mb-6">
      {" "}
      {/* Просто отступ снизу */}
      <div className="flex justify-between items-center mb-4 px-6 pt-6 bg-white shadow rounded-t-lg">
        {" "}
        {/* Шапка секции */}
        <h3 className="text-xl font-semibold text-gray-800">Публикации</h3>
        {/* Кнопка "+" только для своего профиля */}
        {isEditable && (
          <button
            onClick={() => setShowNewPostForm((prev) => !prev)} // Тоггл формы
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            aria-label="Добавить публикацию"
          >
            <PlusCircleIcon className="h-7 w-7" />
          </button>
        )}
      </div>
      {/* Форма для нового поста (показывается над списком) */}
      {isEditable && showNewPostForm && (
        <div className="bg-white shadow p-6 border-t border-gray-100">
          {" "}
          {/* Стиль как у поста */}
          {/* Передаем обработчик успеха и функцию для отмены/скрытия */}
          <PublicationForm
            onPostSaved={handlePostAdded}
            onCancel={() => setShowNewPostForm(false)}
          />
        </div>
      )}
      {/* Лента публикаций */}
      <div className="bg-white shadow rounded-b-lg">
        {" "}
        {/* Контейнер для постов */}
        {isLoading && (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="p-6">
            <ErrorMessage message={error} />
          </div>
        )}
        {!isLoading &&
          !error &&
          publications.length === 0 &&
          !showNewPostForm && (
            <p className="text-gray-500 italic p-6">Публикаций пока нет.</p>
          )}
        {!isLoading && !error && publications.length > 0 && (
          <div className="divide-y divide-gray-100">
            {" "}
            {/* Разделители между постами */}
            {publications.map((post) => (
              <PublicationItem
                key={post.id}
                publication={post}
                isEditable={isEditable} // Передаем возможность редактирования/удаления
                onPostDeleted={handlePostDeleted} // Колбэк для обновления списка после удаления
                onPostUpdated={handlePostUpdated} // Колбэк для обновления списка после редактирования
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePublicationsSection;
