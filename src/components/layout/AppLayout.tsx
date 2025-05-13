// src/components/layout/AppLayout.tsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../contexts/AuthContext"; // Нужен для ProtectedRoute
import MainSidebar from "../dashboard/MainSidebar"; // Убедитесь, что путь правильный
import ChatListPanel from "../sidebar/ChatListPanel"; // Убедитесь, что путь правильный
import ProtectedRoute from "../common/ProtectedRoute"; // Ваш компонент защиты
import Footer from "./Footer";

// Приватные страницы
import MyProfilePage from "../../pages/account/MyProfilePage";
import TherapistListPage from "../../pages/therapists/TherapistListPage";
import UserProfilePage from "../../pages/therapists/UserProfilePage";
import SubscriptionPage from "../../pages/account/SubscriptionPage";
import NotFoundPage from "../../pages/NotFoundPage"; // Для приватной части
import LoadingSpinner from "../common/LoadingSpinner";

const AppLayout: React.FC = () => {
  const { isSidebarExpanded } = useUI();
  const { isAuthenticated, loading: authLoading } = useAuth(); // Получаем isAuthenticated для явной проверки
  const location = useLocation();

  // Показываем спиннер, пока идет проверка статуса аутентификации
  // Это может быть избыточным, если AuthProvider уже это делает, но для ясности
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Эта проверка здесь важна. Если пользователь каким-то образом попал в AppLayout,
  // не будучи аутентифицированным (например, токен истек между рендерами),
  // мы должны его немедленно перенаправить. ProtectedRoute ниже усилит эту защиту.
  if (!isAuthenticated) {
    console.log(
      "AppLayout: Not authenticated, redirecting to /login. Current location:",
      location.pathname
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь аутентифицирован, отображаем основной макет приложения
  return (
    <div className="flex h-screen bg-gray-50">
      <MainSidebar />
      <ChatListPanel />

      <div
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out
                            ${isSidebarExpanded ? "ml-64" : "ml-20"}`}
      >
        {/* Можно добавить приватный Navbar здесь, если он нужен над контентом */}
        <main className="flex-grow overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Основная страница после входа - личный кабинет */}
              {/* ProtectedRoute здесь уже не так критичен, т.к. сам AppLayout доступен только аутентифицированным, */}
              {/* но он полезен для проверки ролей или более гранулярного контроля в будущем. */}
              <Route path="/my-profile" element={<MyProfilePage />} />
              <Route path="/therapists" element={<TherapistListPage />} />
              <Route path="/users/:publicId" element={<UserProfilePage />} />
              <Route
                path="/account/subscription"
                element={
                  <ProtectedRoute requiredRole="THERAPIST">
                    <SubscriptionPage />
                  </ProtectedRoute>
                }
              />

              {/* Если аутентифицированный пользователь попадает на / (корень),
                  /login или /register внутри AppLayout, перенаправляем его в кабинет.
                  Это гарантирует, что он не увидит публичные страницы после входа. */}
              <Route path="/" element={<Navigate to="/my-profile" replace />} />
              <Route
                path="/login"
                element={<Navigate to="/my-profile" replace />}
              />
              <Route
                path="/register"
                element={<Navigate to="/my-profile" replace />}
              />

              {/* Добавьте другие ваши защищенные маршруты здесь */}

              {/* Страница не найдена для приватной части */}
              <Route
                path="*"
                element={<NotFoundPage contextType="authenticated" />}
              />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
