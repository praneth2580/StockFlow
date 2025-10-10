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
    <div className="bg-white shadow-md rounded-lg p-6">
      <ReactMarkdown>{slides[currentSlide]}</ReactMarkdown>

      <div className="flex justify-between mt-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GettingStarted;
