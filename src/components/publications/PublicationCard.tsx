import React from "react";
import { Link } from "react-router-dom";
import { PublicationData } from "../../types/types";

interface PublicationCardProps {
  publication: PublicationData;
  isPreview?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  isOwner?: boolean;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  isPreview = false,
  onDelete,
  onEdit,
  isOwner = false,
}) => {
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Сокращенная версия контента для превью
  const getContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Получаем отображаемое автора
  const getAuthorName = () => {
    if (typeof publication.author === "number") {
      return "Автор"; // Если автора нет, используем заглушку
    }
    return `${publication.author}`;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isPreview ? "hover:shadow-lg transition-shadow" : ""
      }`}
    >
      {publication.featured_image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={publication.featured_image}
            alt={publication.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {isPreview ? (
            <Link
              to={`/publications/${publication.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {publication.title}
            </Link>
          ) : (
            publication.title
          )}
        </h3>

        <div className="text-sm text-gray-500 mb-3 flex items-center justify-between">
          <span>{getAuthorName()}</span>
          <span>{formatDate(publication.created_at)}</span>
        </div>

        <div className="prose text-gray-600 mb-4">
          {isPreview ? (
            <p>{getContentPreview(publication.content)}</p>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: publication.content.replace(/\n/g, "<br>"),
              }}
            />
          )}
        </div>

        {isPreview && (
          <Link
            to={`/publications/${publication.id}`}
            className="inline-block text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Читать далее →
          </Link>
        )}

        {isOwner && !isPreview && (
          <div className="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
            >
              Редактировать
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
            >
              Удалить
            </button>
          </div>
        )}

        {!publication.is_published && (
          <div className="mt-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded inline-block">
            Черновик
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;
