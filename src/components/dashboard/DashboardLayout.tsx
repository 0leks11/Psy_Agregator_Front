import React from "react";
import DashboardSidebar from "./DashboardSidebar";

interface Props {
  children: React.ReactNode; // Основной контент страницы
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[calc(100vh-200px)]">
      {" "}
      {/* Примерная высота минус хедер/футер */}
      {/* Сайдбар */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <DashboardSidebar />
      </aside>
      {/* Основной контент */}
      <section className="flex-grow bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8">
        {children}
      </section>
    </div>
  );
};

export default DashboardLayout;
