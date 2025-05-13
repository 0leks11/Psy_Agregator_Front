import React, { useState, useEffect } from "react";
import { getTherapists } from "../../services/therapistService";
import { ApiTherapistListData } from "../../types/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import TherapistCard from "../../components/therapistList/TherapistCard";
import { useAuth } from "../../hooks/useAuth";

const TherapistListPage: React.FC = () => {
  const { user } = useAuth();
  const loggedInUserId = user?.id;

  const [allTherapists, setAllTherapists] = useState<ApiTherapistListData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterTherapists = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTherapists();

        console.log("API Response:", response);

        if (response && Array.isArray(response.results)) {
          const results = response.results;
          console.log("Raw Results:", results);

          // Фильтруем: исключаем текущего пользователя, если он залогинен
          const filteredResults = loggedInUserId
            ? results.filter((therapist) => therapist.id !== loggedInUserId)
            : results;

          console.log("Filtered Results:", filteredResults);

          setAllTherapists(filteredResults);
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setError("Не удалось загрузить список терапевтов");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterTherapists();
  }, [loggedInUserId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Наши специалисты
      </h1>

      {!loading && !error && allTherapists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTherapists.map((therapist) => (
            <div key={therapist.id} className="border border-red-500">
              <TherapistCard therapist={therapist} />
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Специалисты не найдены</p>
          </div>
        )
      )}
    </div>
  );
};

export default TherapistListPage;
