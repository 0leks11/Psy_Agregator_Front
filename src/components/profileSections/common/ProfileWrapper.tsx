import React, { ReactNode } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

interface ProfileWrapperProps {
  title: string;
  children: ReactNode;
  isEditable: boolean;
  isEditing: boolean; // Whether the content inside is currently in edit mode
  onEditClick: () => void;
  className?: string; // Allow passing additional classes
}

const ProfileWrapper: React.FC<ProfileWrapperProps> = ({
  title,
  children,
  isEditable,
  isEditing,
  onEditClick,
  className = "",
}) => {
  return (
    <div
      className={`bg-white shadow rounded-lg p-6 mb-6 relative group ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {/* Show edit button only if editable and not already editing */}
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
      <div>{children}</div>
    </div>
  );
};

export default ProfileWrapper;
