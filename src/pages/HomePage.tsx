import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <div className="row align-items-center min-vh-75">
        <div className="col-md-6">
          <h1 className="display-4 mb-4">Найдите своего психолога</h1>
          <p className="lead mb-4">
            PsyAgregator - это платформа, где вы можете найти квалифицированного
            психолога для решения ваших проблем и улучшения качества жизни.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <Link
              to="/therapists"
              className="btn btn-primary btn-lg px-4 me-md-2"
            >
              Найти психолога
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Стать психологом
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <img
            src="/images/hero-image.jpg"
            alt="Психологическая консультация"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
