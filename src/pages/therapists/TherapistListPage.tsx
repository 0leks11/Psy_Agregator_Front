import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTherapists } from "../../services/therapistService";
import { TherapistProfileReadData } from "../../types/user";

const TherapistListPage: React.FC = () => {
  const [therapists, setTherapists] = useState<TherapistProfileReadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const data = await getTherapists();
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
                src={
                  therapist.profile.profile_picture_url ||
                  "/default-therapist.jpg"
                }
                className="card-img-top"
                alt={`${therapist.user.first_name} ${therapist.user.last_name}`}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {therapist.user.first_name} {therapist.user.last_name}
                </h5>
                <p className="card-text">
                  <strong>О себе:</strong> {therapist.about || "Нет информации"}
                </p>
                <p className="card-text">
                  <strong>Опыт:</strong> {therapist.experience_years} лет
                </p>
                <p className="card-text">
                  <strong>Навыки:</strong>{" "}
                  {therapist.skills.map((skill) => skill.name).join(", ")}
                </p>
                <p className="card-text">
                  <strong>Языки:</strong>{" "}
                  {therapist.languages.map((lang) => lang.name).join(", ")}
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
