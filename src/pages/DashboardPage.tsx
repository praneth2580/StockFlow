import Modal from "../components/Modal";
import GettingStarted from "../components/GettingStarted";
import type React from "react";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const [showGettingStarted, setShowGettingStarted] = useState<boolean>(false);
  const [slides, setSlides] = useState<string[]>([]);

   // Check localStorage for 'hideGettingStarted' on initial load
  useState<() => void>(() => {
    const scriptId: string | null = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
    if (scriptId === '' || !scriptId) {
      setShowGettingStarted(true);
    }
  });

  // Effect to listen for changes in localStorage
  useState<() => void>(() => {
    const handleStorageChange = (): void => {
      const scriptId: string | null = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
      setShowGettingStarted(scriptId === '' || !scriptId);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  });

  useEffect(() => {
    const fetchSlides = async () => {
      const modules = import.meta.glob('../assets/markdowns/getting-started/*.md', { as: 'raw' });
      const sortedPaths = Object.keys(modules).sort();
      
      const slideContents = await Promise.all(
        sortedPaths.map(path => modules[path]())
      );
      setSlides(slideContents);
    };

    fetchSlides();
  }, []);

  return (
    <>
      <div>Dashboard Page</div>
      <GettingStartedModal show={showGettingStarted} onClose={() => { setShowGettingStarted(false); }} slides={slides} />
    </>
  );
};

const GettingStartedModal: React.FC<{ show: boolean; onClose: () => void; slides: string[] }> = ({
  show,
  onClose,
  slides,
}) => {
  return (
    <Modal show={show} onClose={onClose} title="Getting Started" size="xl">
      {slides.length > 0 ? <GettingStarted slides={slides} /> : <p>Loading...</p>}
    </Modal>
  );
};

export default DashboardPage;
