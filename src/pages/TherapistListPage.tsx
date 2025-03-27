import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  price: number;
  image: string;
}

const TherapistListPage: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        // Здесь будет API-запрос
        const response = await fetch("/api/therapists");
        const data = await response.json();
        setTherapists(data);
      } catch (err) {
        setError("Ошибка при загрузке списка психологов");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) {
    return (
      <div className="container text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Наши психологи</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {therapists.map((therapist) => (
          <div key={therapist.id} className="col">
            <div className="card h-100">
              <img
                src={therapist.image}
                className="card-img-top"
                alt={therapist.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{therapist.name}</h5>
                <p className="card-text">
                  <strong>Специализация:</strong> {therapist.specialization}
                </p>
                <p className="card-text">
                  <strong>Опыт:</strong> {therapist.experience} лет
                </p>
                <p className="card-text">
                  <strong>Рейтинг:</strong>{" "}
                  <span className="text-warning">
                    {"★".repeat(Math.round(therapist.rating))}
                    {"☆".repeat(5 - Math.round(therapist.rating))}
                  </span>
                </p>
                <p className="card-text">
                  <strong>Стоимость:</strong> {therapist.price} ₽/час
                </p>
                <Link
                  to={`/therapists/${therapist.id}`}
                  className="btn btn-primary"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TherapistListPage;
