import React, { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const plans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Базовый",
      price: 999,
      duration: 30,
      features: [
        "Доступ к базовому функционалу",
        "До 10 консультаций в месяц",
        "Базовая статистика",
        "Email поддержка",
      ],
    },
    {
      id: "pro",
      name: "Про",
      price: 1999,
      duration: 30,
      features: [
        "Все функции базового плана",
        "Неограниченное количество консультаций",
        "Расширенная статистика",
        "Приоритетная поддержка",
        "Продвижение в поиске",
      ],
    },
    {
      id: "enterprise",
      name: "Бизнес",
      price: 4999,
      duration: 30,
      features: [
        "Все функции про плана",
        "Персональный менеджер",
        "API доступ",
        "Интеграция с CRM",
        "Максимальное продвижение",
      ],
    },
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    setError("");

    try {
      // Здесь будет API-запрос для обработки подписки
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при оформлении подписки");
      }

      // Перенаправление на страницу успешной оплаты
      window.location.href = "/payment-success";
    } catch (err) {
      setError("Произошла ошибка при оформлении подписки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-5">Выберите план подписки</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {plans.map((plan) => (
          <div key={plan.id} className="col">
            <div
              className={`card h-100 ${
                selectedPlan === plan.id ? "border-primary" : ""
              }`}
            >
              <div className="card-body">
                <h3 className="card-title text-center">{plan.name}</h3>
                <div className="text-center mb-4">
                  <span className="h2">{plan.price} ₽</span>
                  <span className="text-muted">/месяц</span>
                </div>
                <ul className="list-unstyled">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-4">
                  <button
                    className={`btn ${
                      selectedPlan === plan.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                    disabled={loading}
                  >
                    {loading ? "Обработка..." : "Выбрать план"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div className="text-center mt-4">
          <button
            className="btn btn-success btn-lg"
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={loading}
          >
            {loading ? "Обработка..." : "Оформить подписку"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
