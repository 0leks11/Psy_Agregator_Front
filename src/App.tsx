import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import TherapistListPage from "./pages/therapists/TherapistListPage";
import UserProfilePage from "./pages/therapists/UserProfilePage";
import MyProfilePage from "./pages/account/MyProfilePage";
import SubscriptionPage from "./pages/account/SubscriptionPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected Route Component
import ProtectedRoute from "./components/common/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/therapists" element={<TherapistListPage />} />
              <Route path="/users/:userId" element={<UserProfilePage />} />
              <Route
                path="/therapist/:therapistProfileId"
                element={<UserProfilePage />}
              />

              {/* Protected Routes */}
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute>
                    <MyProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute requiredRole="THERAPIST">
                    <SubscriptionPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch All - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
