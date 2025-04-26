import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTherapists } from "../../services/therapistService";
import { ApiTherapistListData } from "../../types/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import TherapistCard from "../../components/therapistList/TherapistCard";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const TherapistListPage: React.FC = () => {
  const [therapists, setTherapists] = useState<ApiTherapistListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTherapists();

      console.log("API Response:", response);

      if (response && Array.isArray(response.results)) {
        const results = response.results;
        console.log("Raw Results:", results);

        // Временная минимальная фильтрация
        const validTherapists = results.filter((therapist) => {
          const isValid =
            therapist &&
            therapist.id &&
            therapist.first_name &&
            therapist.last_name;

          if (!isValid) {
            console.warn("Invalid therapist data:", therapist);
          }

          return isValid;
        });

        console.log("Filtered Therapists:", validTherapists);
        setTherapists(validTherapists);
        setCount(response.count);
        setNextUrl(response.next);
        setPrevUrl(response.previous);
      }
    } catch (err) {
      console.error("Error fetching therapists:", err);
      setError("Не удалось загрузить список терапевтов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

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

      {console.log("Rendering therapists count:", therapists.length)}

      {!loading && !error && therapists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => {
            console.log("Rendering therapist:", therapist);
            return (
              <div key={therapist.id} className="border border-red-500">
                <TherapistCard therapist={therapist} />
              </div>
            );
          })}
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
