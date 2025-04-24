import React from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import MyProfileDisplay from "../components/dashboard/MyProfileDisplay";

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <MyProfileDisplay />
    </DashboardLayout>
  );
};

export default DashboardPage;
