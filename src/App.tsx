// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  
  Outlet, // Для создания "обертки" для публичных страниц
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import AppLayout from "./components/layout/AppLayout"; // Макет для приватной части
import { ChatProvider } from "./contexts/ChatContext";

// Публичные страницы
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage"; // Общая страница 404

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Компонент-обертка для публичных страниц (без сайдбара)
const PublicLayout: React.FC = () => {
  // Здесь можно добавить общий макет для публичных страниц, если он нужен
  // Например, свой Navbar и Footer, отличные от тех, что в AppLayout
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {" "}
      {/* Пример фона для публичных страниц */}
      {/* Можно добавить свой публичный Navbar здесь, если он отличается от приватного */}
      <main className="flex-grow">
        <Outlet />{" "}
        {/* Сюда будут рендериться HomePage, LoginPage, RegisterPage */}
      </main>
      {/* Можно добавить свой публичный Footer здесь */}
    </div>
  );
};

// Основной компонент, управляющий роутингом
const AppRoutesController: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      {isAuthenticated ? (
        // --- Пользователь АУТЕНТИФИЦИРОВАН ---
        // Все маршруты для аутентифицированного пользователя обрабатываются внутри AppLayout
        <Route path="/*" element={<AppLayout />} />
      ) : (
        // --- Пользователь НЕ АУТЕНТИФИЦИРОВАН ---
        <Route element={<PublicLayout />}>
          {" "}
          {/* Обертка для публичных страниц */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Для неаутентифицированных пользователей все неизвестные пути ведут на 404 "public" */}
          <Route path="*" element={<NotFoundPage contextType="public" />} />
        </Route>
      )}
      {/* Общий NotFoundPage, если ни один из вышестоящих не сработал
          (маловероятно при текущей структуре, но как запасной вариант) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <ChatProvider>
            <AppRoutesController />
          </ChatProvider>
        </UIProvider>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
};

export default App;
