import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TherapistListPage from "./pages/TherapistListPage";
import TherapistDetailPage from "./pages/TherapistDetailPage";
import DashboardPage from "./pages/DashboardPage";
import TherapistProfileEditPage from "./pages/TherapistProfileEditPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected Route Component
import ProtectedRoute from "./components/common/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <main style={{ flexGrow: 1, padding: "20px" }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/therapists" element={<TherapistListPage />} />
              <Route
                path="/therapists/:therapistId"
                element={<TherapistDetailPage />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute requiredRole="therapist">
                    <TherapistProfileEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute requiredRole="therapist">
                    <SubscriptionPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch All - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
