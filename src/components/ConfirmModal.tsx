import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title: string;
  body: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ModalData {
  title: string;
  body: string;
  onSuccess: () => void;
}

export const ConfirmModal: React.FC<ModalProps> = ({ show, onClose, onSuccess, title, body, size = 'lg' }) => {
  if (!show) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-xl', // 36rem
    md: 'max-w-2xl', // 42rem
    lg: 'max-w-4xl', // 56rem
    xl: 'max-w-6xl', // 72rem
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
      <div
        className={`
        bg-white dark:bg-gray-900 
        rounded-xl p-6 w-full 
        ${sizeClasses[size]} 
        flex flex-col max-h-[80vh] 
        shadow-xl border border-gray-200 dark:border-gray-700
        transition-colors
      `}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2 mb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-3xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto text-gray-800 dark:text-gray-300">
          <h2>{body}</h2>

          {/* Buttons */}
          <div className="flex gap-2 items-center mt-6">
            <button
              onClick={onSuccess}
              className="
              w-full py-3 rounded-lg font-semibold text-lg transition 
              bg-blue-600 text-white hover:bg-blue-700
              dark:bg-blue-500 dark:hover:bg-blue-600
            "
            >
              Yes
            </button>

            <button
              onClick={onClose}
              className="
              w-full py-3 rounded-lg font-semibold text-lg transition 
              bg-gray-500 text-white hover:bg-gray-700
              dark:bg-gray-600 dark:hover:bg-gray-500
            "
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
