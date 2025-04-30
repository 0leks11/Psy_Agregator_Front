import React from "react";
import { Link } from "react-router-dom";
import { ApiTherapistListData } from "../../types/api";
import { API_URL, DEFAULT_AVATAR_URL, FALLBACK_AVATAR } from "../../constants";

interface TherapistCardProps {
  therapist: ApiTherapistListData;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  const avatarUrl = therapist.profile?.profile_picture_url;
  const backupAvatarUrl = `${API_URL}${DEFAULT_AVATAR_URL}`;

  return (
    <Link
      to={`/users/${therapist.public_id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={avatarUrl!}
            alt={`${therapist.first_name} ${therapist.last_name}`}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== backupAvatarUrl) {
                target.src = backupAvatarUrl;
              } else {
                target.src = FALLBACK_AVATAR;
              }
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {therapist.first_name} {therapist.last_name}
            </h3>
            {therapist.therapist_profile?.is_verified && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Верифицирован
              </span>
            )}
          </div>
        </div>

        {therapist.therapist_profile?.about && (
          <p className="mt-3 text-gray-600 text-sm line-clamp-3">
            {therapist.therapist_profile.about}
          </p>
        )}

        {therapist.therapist_profile?.skills && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {therapist.therapist_profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default TherapistCard;
