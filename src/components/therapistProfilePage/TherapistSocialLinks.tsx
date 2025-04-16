import React from "react";
// Импортируйте иконки соцсетей (например, из react-icons)
// import { FaLinkedin, FaGlobe } from 'react-icons/fa';

interface Props {
  websiteUrl: string | null;
  linkedinUrl: string | null;
  // Добавить другие пропсы для соцсетей
}

const TherapistSocialLinks: React.FC<Props> = ({ websiteUrl, linkedinUrl }) => {
  const links = [
    {
      url: websiteUrl,
      label: "Веб-сайт",
      icon: "🌐" /* Заменить на <FaGlobe/> */,
    },
    {
      url: linkedinUrl,
      label: "LinkedIn",
      icon: "LI" /* Заменить <FaLinkedin/> */,
    },
    // Добавить другие
  ].filter((link) => link.url); // Оставляем только существующие ссылки

  if (links.length === 0) return null;

  return (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ссылки</h2>
      <div className="flex flex-wrap gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url!} // Уверенность, что url не null после filter
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            {/* Иконка */}
            <span className="mr-1 text-xl">{link.icon}</span>
            {/* Можно скрыть текст на маленьких экранах */}
            <span className="hidden sm:inline">{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default TherapistSocialLinks;
