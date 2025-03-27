import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Appointment {
  id: string;
  therapistName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointments: Appointment[];
}

const UserCabinetPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Здесь будет API-запрос
        const response = await fetch("/api/user/profile");
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(
          `Ошибка при загрузке профиля: ${
            err instanceof Error ? err.message : "Неизвестная ошибка"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  if (error || !profile) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error || "Профиль не найден"}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Профиль</h3>
              <div className="mb-3">
                <strong>Имя:</strong> {profile.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="mb-3">
                <strong>Телефон:</strong> {profile.phone}
              </div>
              <button className="btn btn-primary">Редактировать профиль</button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Мои записи</h3>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Психолог</th>
                      <th>Дата</th>
                      <th>Время</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.therapistName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>
                          <span
                            className={`badge ${
                              appointment.status === "confirmed"
                                ? "bg-success"
                                : appointment.status === "pending"
                                ? "bg-warning"
                                : appointment.status === "completed"
                                ? "bg-info"
                                : "bg-danger"
                            }`}
                          >
                            {appointment.status === "confirmed"
                              ? "Подтверждено"
                              : appointment.status === "pending"
                              ? "Ожидает подтверждения"
                              : appointment.status === "completed"
                              ? "Завершено"
                              : "Отменено"}
                          </span>
                        </td>
                        <td>
                          {appointment.status === "pending" && (
                            <button className="btn btn-sm btn-danger">
                              Отменить
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCabinetPage;
