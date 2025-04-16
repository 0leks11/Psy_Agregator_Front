import React, { useState, useEffect } from "react";
import { getTherapistPublications } from "../../services/therapistService";
import { PublicationData } from "../../types/models";
import PublicationCard from "./PublicationCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

interface Props {
  therapistProfileId: number; // Используем ID профиля терапевта
}

const TherapistPublicationsList: React.FC<Props> = ({ therapistProfileId }) => {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTherapistPublications(therapistProfileId);
        setPublications(data);
      } catch (err: any) {
        setError("Не удалось загрузить публикации.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [therapistProfileId]); // Перезагружаем при смене ID

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  if (error) return <ErrorMessage message={error} />;
  if (publications.length === 0) {
    return (
      <section className="mb-8 p-6 bg-white rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Публикации
        </h2>
        <p className="text-gray-500">
          У этого специалиста пока нет публикаций.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 p-6 bg-white rounded-t-lg shadow-sm border-b border-gray-200">
        Публикации
      </h2>
      <div className="space-y-4">
        {" "}
        {/* Отступы между карточками */}
        {publications.map((pub) => (
          <PublicationCard key={pub.id} publication={pub} />
        ))}
      </div>
      {/* TODO: Добавить пагинацию, если постов много */}
    </section>
  );
};

export default TherapistPublicationsList;
