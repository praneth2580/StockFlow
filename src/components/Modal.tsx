import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children, size = 'lg' }) => {
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
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">
            &times;
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
