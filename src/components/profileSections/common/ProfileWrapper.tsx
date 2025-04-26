import React, { ReactNode } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

interface ProfileWrapperProps {
  title: string;
  isEditable: boolean;
  isEditing: boolean;
  onEditClick?: () => void;
  children: React.ReactNode;
}

const ProfileWrapper: React.FC<ProfileWrapperProps> = ({
  title,
  isEditable,
  isEditing,
  onEditClick,
  children,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {isEditable && !isEditing && (
          <button
            onClick={onEditClick}
            className="p-1 text-gray-700 hover:text-blue-600  group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
            aria-label={`Редактировать ${title}`}
          >
            <PencilIcon className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default ProfileWrapper;
