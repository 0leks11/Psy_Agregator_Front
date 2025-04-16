import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { FullUserData } from "../types/types";
import PhotoGalleryManager from "../components/therapists/PhotoGalleryManager";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

const PhotosPage: React.FC = () => {
  const { user, loading } = useAuth();
  const typedUser = user as FullUserData | null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!typedUser) {
    return (
      <div className="text-center py-8">
        <ErrorMessage message="Пожалуйста, войдите в систему для управления фотографиями." />
      </div>
    );
  }

  if (!typedUser.therapist_profile) {
    return (
      <div className="text-center py-8">
        <ErrorMessage message="Эта страница доступна только для психологов." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Управление фотографиями
        </h1>
        <p className="text-gray-600">
          Здесь вы можете загружать, упорядочивать и удалять фотографии для
          вашей галереи. Эти фотографии будут видны посетителям вашего профиля.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <PhotoGalleryManager therapistId={typedUser.therapist_profile.id} />
      </div>
    </div>
  );
};

export default PhotosPage;
