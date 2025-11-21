import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface GettingStartedProps {
  slides: string[];
}

const GettingStarted: React.FC<GettingStartedProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">

      {/* Markdown Slide */}
      <ReactMarkdown>{slides[currentSlide]}</ReactMarkdown>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="
          bg-gray-300 hover:bg-gray-400 text-gray-800 
          dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200
          font-bold py-2 px-4 rounded 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
        >
          Back
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="
          bg-blue-500 hover:bg-blue-700 text-white 
          dark:bg-blue-600 dark:hover:bg-blue-500
          font-bold py-2 px-4 rounded 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
        >
          Next
        </button>
      </div>
    </div>
  );

};

export default GettingStarted;
