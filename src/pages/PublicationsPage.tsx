import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FullUserData, PublicationData } from "../types/types";
import {
  getPublications,
  deletePublication,
} from "../services/therapistService";
import PublicationCard from "../components/publications/PublicationCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

const PublicationsPage: React.FC = () => {
  const { user, loading: loadingUser } = useAuth();
  const typedUser = user as FullUserData | null;

  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPublications, setTotalPublications] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Загрузка публикаций психолога
  useEffect(() => {
    const fetchPublications = async () => {
      if (!typedUser || !typedUser.therapist_profile) return;

      try {
        setLoading(true);
        setError(null);

        const result = await getPublications(page, 10, typedUser.id);
        setPublications(result.data);
        setTotalPublications(result.total);
        setTotalPages(result.pages);
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке публикаций");
      } finally {
        setLoading(false);
      }
    };

    if (typedUser && !loadingUser) {
      fetchPublications();
    }
  }, [typedUser, loadingUser, page]);

  // Удаление публикации
  const handleDelete = async (publicationId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту публикацию?")) {
      return;
    }

    try {
      await deletePublication(publicationId);
      // Обновляем список публикаций после удаления
      setPublications(publications.filter((pub) => pub.id !== publicationId));

      // Если удалили последнюю публикацию на странице, переходим на предыдущую
      if (publications.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении публикации");
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!typedUser) {
    return (
      <div className="text-center py-8">
        <ErrorMessage message="Пожалуйста, войдите в систему для просмотра публикаций." />
      </div>
    );
  }

  if (!typedUser.therapist_profile) {
    return (
      <div className="text-center py-8">
        <ErrorMessage message="Этот раздел доступен только для психологов." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Мои публикации
          </h1>
          <p className="text-gray-600">
            Здесь вы можете создавать и управлять вашими публикациями. Они будут
            видны всем посетителям сайта.
          </p>
        </div>
        <Link
          to="/publications/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150"
        >
          + Новая публикация
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="bg-white shadow-lg rounded-lg p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner />
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">У вас пока нет публикаций</p>
            <Link
              to="/publications/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
            >
              Создать первую публикацию
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {publications.map((publication) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                isOwner={true}
                onDelete={() => handleDelete(publication.id)}
                onEdit={() =>
                  (window.location.href = `/publications/edit/${publication.id}`)
                }
              />
            ))}

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                  >
                    &laquo; Назад
                  </button>

                  <div className="flex items-center px-4">
                    <span className="text-gray-600">
                      Страница {page} из {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                  >
                    Вперед &raquo;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;
