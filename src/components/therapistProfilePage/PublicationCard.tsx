import React from "react";
import { PublicationData } from "../../types/models";
import { Link } from "react-router-dom"; // Если будет детальная страница поста

interface Props {
  publication: PublicationData;
}

const PublicationCard: React.FC<Props> = ({ publication }) => {
  const { title, content_snippet, featured_image, created_at, id } =
    publication;
  const formattedDate = new Date(created_at).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // TODO: Ссылка на детальную страницу поста
  const postUrl = `/publications/${id}`; // Пример

  return (
    <article className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {featured_image && (
        <div className="sm:w-1/4 flex-shrink-0">
          {/* <Link to={postUrl}> */}
          <img
            src={featured_image}
            alt={title}
            className="w-full h-32 sm:h-full object-cover rounded-md"
          />
          {/* </Link> */}
        </div>
      )}
      <div className="flex-grow">
        {/* <Link to={postUrl} className="hover:text-blue-700"> */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        {/* </Link> */}
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {content_snippet}
        </p>
        {/* <Link to={postUrl} className="text-blue-600 hover:underline text-sm font-medium">Читать далее...</Link> */}
      </div>
    </article>
  );
};

export default PublicationCard;
