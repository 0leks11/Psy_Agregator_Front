// src/components/profileSections/publications/ProfilePublicationsSection.tsx
import React, { useState, useEffect } from "react";
import { ProfileSectionProps, Publication } from "../../../types/models";
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

// Расширяем интерфейс для поддержки внешних публикаций
interface ProfilePublicationsSectionProps extends ProfileSectionProps {
  initialPublications?: Publication[] | null;
}

const ProfilePublicationsSection: React.FC<ProfilePublicationsSectionProps> = ({
  userData,
  isEditable,
  initialPublications,
}) => {
  const { user } = useAuth(); // Нужен для определения, чей профиль смотрим
  const [publications, setPublications] = useState<Publication[]>(
    initialPublications || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Определяем ID пользователя, чьи публикации загружать ТОЛЬКО ЕСЛИ isEditable
  const loggedInUserId = user?.id;

  // Загрузка публикаций ТОЛЬКО для своего профиля (когда isEditable === true)
  useEffect(() => {
    // Загружаем, только если это свой профиль И initialPublications не были переданы
    if (isEditable && loggedInUserId && !initialPublications) {
      const fetchOwnPublications = async () => {
        setIsLoading(true);
        setError(null);
        try {
          console.log(
            `ProfilePublicationsSection: Fetching publications for own profile (ID: ${loggedInUserId})`
          );
          const fetchedPublications = await getMyPublications(loggedInUserId);
          setPublications(fetchedPublications || []);
        } catch (err: any) {
          console.error("Error fetching own publications:", err);
          setError("Не удалось загрузить ваши публикации.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchOwnPublications();
    } else if (!isEditable && initialPublications) {
      // Если смотрим чужой профиль, используем УЖЕ ЗАГРУЖЕННЫЕ данные из props
      console.log(
        "ProfilePublicationsSection: Using initialPublications from props"
      );
      setPublications(initialPublications);
      setIsLoading(false);
      setError(null);
    } else if (!isEditable && !initialPublications) {
      // Случай, когда смотрим чужой профиль, но данные не пришли (ошибка?)
      console.warn(
        "ProfilePublicationsSection: Viewing non-editable profile but no initialPublications provided."
      );
      setPublications([]);
      setIsLoading(false);
    }
  }, [isEditable, loggedInUserId, initialPublications]);

  // Обработчик успешного добавления нового поста
  const handlePostAdded = (newPost: Publication) => {
    setPublications((prev) => [newPost, ...prev]);
    setShowNewPostForm(false);
    toast.success("Публикация добавлена!");
  };

  // Обработчик успешного удаления поста
  const handlePostDeleted = (deletedPostId: number | string) => {
    setPublications((prev) => prev.filter((post) => post.id !== deletedPostId));
    toast.success("Публикация удалена!");
  };

  // Обработчик успешного обновления поста
  const handlePostUpdated = (updatedPost: Publication) => {
    setPublications((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
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
