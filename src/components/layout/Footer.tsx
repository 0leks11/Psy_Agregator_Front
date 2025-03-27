import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">
              &copy; 2024 PsyAgregator. Все права защищены.
            </p>
          </div>
          <div className="col-md-6 text-end">
            <a href="/privacy" className="text-muted me-3">
              Конфиденциальность
            </a>
            <a href="/terms" className="text-muted">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
