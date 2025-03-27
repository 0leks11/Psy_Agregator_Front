import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  price: number;
  image: string;
  description: string;
  education: string[];
  methods: string[];
  schedule: {
    [key: string]: string[];
  };
}

const TherapistDetailPage: React.FC = () => {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        // Здесь будет API-запрос
        const response = await fetch(`/api/therapists/${therapistId}`);
        const data = await response.json();
        setTherapist(data);
      } catch (err) {
        setError(
          `Ошибка при загрузке данных психолога: ${
            err instanceof Error ? err.message : "Неизвестная ошибка"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [therapistId]);

  if (loading) {
    return (
      <div className="container text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error || "Психолог не найден"}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <img
            src={therapist.image}
            alt={therapist.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h2>{therapist.name}</h2>
          <p className="lead">{therapist.specialization}</p>
          <div className="mb-3">
            <strong>Опыт:</strong> {therapist.experience} лет
          </div>
          <div className="mb-3">
            <strong>Рейтинг:</strong>{" "}
            <span className="text-warning">
              {"★".repeat(Math.round(therapist.rating))}
              {"☆".repeat(5 - Math.round(therapist.rating))}
            </span>
          </div>
          <div className="mb-3">
            <strong>Стоимость:</strong> {therapist.price} ₽/час
          </div>
          <button className="btn btn-primary">
            Записаться на консультацию
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h3>О психологе</h3>
          <p>{therapist.description}</p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <h3>Образование</h3>
          <ul>
            {therapist.education.map((edu, index) => (
              <li key={index}>{edu}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h3>Методы работы</h3>
          <ul>
            {therapist.methods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h3>Расписание</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(therapist.schedule).map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.values(therapist.schedule).map((times, index) => (
                    <td key={index}>
                      {times.map((time, timeIndex) => (
                        <div key={timeIndex}>{time}</div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetailPage;
