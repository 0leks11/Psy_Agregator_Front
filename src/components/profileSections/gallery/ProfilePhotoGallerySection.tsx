import React from "react";
import { TherapistPhotoData } from "../../../types/types";

interface Props {
  photos: TherapistPhotoData[];
}

const TherapistPhotoGallery: React.FC<Props> = ({ photos = [] }) => {
  if (photos.length === 0) return null;

  return (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Фотогалерея
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg aspect-square"
          >
            <img
              src={photo.image}
              alt={photo.caption || `Фото ${photo.id}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.caption}
              </div>
            )}
            {/* Добавить onClick для открытия в модалке/лайтбоксе позже */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TherapistPhotoGallery;
