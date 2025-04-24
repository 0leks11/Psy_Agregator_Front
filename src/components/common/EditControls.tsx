import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner"; // Исправленный путь импорта

interface EditControlsProps {
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
}

const EditControls: React.FC<EditControlsProps> = ({
  isLoading,
  onCancel,
  onSave,
  saveText = "Сохранить",
  cancelText = "Отмена",
}) => {
  return (
    <div className="flex justify-end space-x-3 mt-4">
      <button
        type="button" // Prevent implicit form submission if wrapped in form
        onClick={onCancel}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out disabled:opacity-50 flex items-center"
      >
        <XMarkIcon className="h-5 w-5 mr-1" />
        {cancelText}
      </button>
      <button
        type="button" // Prevent implicit form submission
        onClick={onSave}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[100px] justify-center" // Added min-width and justify
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <CheckIcon className="h-5 w-5 mr-1" />
            {saveText}
          </>
        )}
      </button>
    </div>
  );
};

export default EditControls;
