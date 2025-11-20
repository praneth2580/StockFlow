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
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center p-4">
      <div className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]} flex flex-col max-h-[80vh]`}>
        <div className="flex justify-between items-center pb-2 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">
            &times;
          </button>
        </div>
        <div className="overflow-y-auto">
          <h2>{body}</h2>
          <div className="flex gap-1 items-center">
            <button
              onClick={onSuccess}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-slate-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-slate-700 transition"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
