import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface TherapistProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  price: number;
  description: string;
  education: string[];
  methods: string[];
  schedule: {
    [key: string]: string[];
  };
}

const TherapistProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Здесь будет API-запрос
        const response = await fetch("/api/therapist/profile");
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Ошибка при загрузке профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      // Здесь будет API-запрос
      const response = await fetch("/api/therapist/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSuccess("Профиль успешно обновлен");
      } else {
        setError("Ошибка при обновлении профиля");
      }
    } catch (err) {
      setError("Ошибка при обновлении профиля");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEducationChange = (index: number, value: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      const newEducation = [...prev.education];
      newEducation[index] = value;
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setProfile((prev) => {
      if (!prev) return null;
      return { ...prev, education: [...prev.education, ""] };
    });
  };

  const removeEducation = (index: number) => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      };
    });
  };

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
      <h2 className="mb-4">Редактирование профиля</h2>
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Имя
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Телефон
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="specialization" className="form-label">
            Специализация
          </label>
          <input
            type="text"
            className="form-control"
            id="specialization"
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="experience" className="form-label">
            Опыт (лет)
          </label>
          <input
            type="number"
            className="form-control"
            id="experience"
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Стоимость (₽/час)
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={profile.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Описание
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Образование</label>
          {profile.education.map((edu, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={edu}
                onChange={(e) => handleEducationChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeEducation(index)}
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addEducation}
          >
            Добавить образование
          </button>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Сохранить изменения
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/dashboard")}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapistProfileEditPage;
