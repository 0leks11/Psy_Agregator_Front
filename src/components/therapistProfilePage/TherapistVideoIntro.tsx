import React from "react";

interface Props {
  videoUrl: string | null;
}

// Функция для получения ID видео из URL Youtube/Vimeo (упрощенная)
const getEmbedUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    if (
      parsedUrl.hostname.includes("youtube.com") ||
      parsedUrl.hostname.includes("youtu.be")
    ) {
      const videoId =
        parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
  } catch (e) {
    console.error("Invalid video URL:", url, e);
  }
  return null; // Возвращаем null если URL не распознан или невалиден
};

const TherapistVideoIntro: React.FC<Props> = ({ videoUrl }) => {
  if (!videoUrl) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    console.warn("Could not generate embed URL for:", videoUrl);
    return (
      <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Видео-визитка
        </h2>
        <p className="text-gray-600">
          Не удалось отобразить видео.{" "}
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Посмотреть по ссылке
          </a>
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Видео-визитка
      </h2>
      {/* Адаптивный контейнер для видео */}
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={embedUrl}
          title="Видео-визитка терапевта"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
    </section>
  );
};

export default TherapistVideoIntro;
