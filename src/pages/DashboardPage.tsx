import React from "react";
import { useAuth } from "../contexts/AuthContext";
import UserCabinetPage from "./UserCabinetPage";
import TherapistCabinetPage from "./TherapistCabinetPage";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          Пожалуйста, войдите в систему
        </div>
      </div>
    );
  }

  return user.role === "therapist" ? (
    <TherapistCabinetPage />
  ) : (
    <UserCabinetPage />
  );
};

export default DashboardPage;
