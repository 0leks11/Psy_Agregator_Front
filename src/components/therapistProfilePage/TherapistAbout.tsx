import React from "react";

interface Props {
  about: string | null;
}

const TherapistAbout: React.FC<Props> = ({ about }) => {
  if (!about) return null; // Не рендерим, если нет текста

  return (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Обо мне
      </h2>
      {/* Используем whitespace-pre-wrap для сохранения переносов строк из textarea */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {about}
      </p>
    </section>
  );
};

export default TherapistAbout;
