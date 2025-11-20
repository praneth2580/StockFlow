import { useState } from 'react';
import { Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom';
import { routeConfig } from './routes';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';

const Layout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${isNavOpen ? 'overflow-hidden' : ''}`}>
      <div className="md:hidden flex items-center justify-between p-2 bg-white border-b border-gray-200 w-full fixed">
        <button className="text-2xl bg-transparent border-none cursor-pointer text-black" onClick={toggleNav}>
          &#9776;
        </button>
      </div>
      <nav className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-white border-r border-gray-200 p-5 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isNavOpen ? 'translate-x-0 z-50' : '-translate-x-full'}`}>
        <div className="flex items-center mb-5">
          <div className="bg-[url(banner.png)] w-full h-15 mr-3 bg-cover bg-center rounded" />
          {/* <img src="banner.png" alt="Brand Logo" className="w-full h-15 mr-3 bg-cover bg-center" /> */}
          {/* <img src="logo.png" alt="Brand Logo" className="h-8 mr-3" /> */}
          {/* <span className="text-xl font-bold text-blue-500">Storix</span> */}
        </div>
        <ul className="list-none p-0 m-0">
          {routeConfig.map((route) => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `block p-4 text-gray-700 rounded-lg mb-2 transition-colors duration-300 ${isActive ? 'bg-blue-100 text-blue-500 font-bold' : 'hover:bg-blue-100 hover:text-blue-500'
                  }`
                }
                onClick={() => setIsNavOpen(false)}
              >
                {route.name}
              </NavLink>
            </li>
          ))}
          <li key="/pos">
            <NavLink
              to="/pos"
              target="_blank" rel="noopener noreferrer"
              className={({ isActive }) =>
                `block p-4 bg-blue-400 text-white text-center font-bold rounded-lg mb-2 transition-colors duration-300 ${isActive ? 'bg-blue-100 text-blue-500 font-bold' : 'hover:bg-blue-100 hover:text-blue-500'
                }`
              }
              
              onClick={() => setIsNavOpen(false)}
            >
              POS
            </NavLink>
          </li>
        </ul>
      </nav>
      {isNavOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={toggleNav}></div>}
      <main className="flex-grow p-5 overflow-y-auto mt-12 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

const ProtectedRoute = ({
  isAllowed,
  children,
}: {
  isAllowed: boolean;
  children: React.ReactNode;
}) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  const [isScriptIDPresent, setIsScriptIDPresent] = useState<boolean>(true);

  // Check localStorage for 'hideGettingStarted' on initial load
  useState<() => void>(() => {
    const scriptId: string | null = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
    if (scriptId === '' || !scriptId) {
      setIsScriptIDPresent(false);
    }
  });

  // Effect to listen for changes in localStorage
  useState<() => void>(() => {
    const handleStorageChange = (): void => {
      const scriptId: string | null = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
      setIsScriptIDPresent(scriptId === '' || !scriptId);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home route — always allowed */}
        <Route index element={<DashboardPage />} />

        {routeConfig.map((route) => {
          // const Component = pageComponents[route.name];
          const Component = route.component;
          if (!Component || route.path === "/") return null;

          return (
            <Route
              key={route.path}
              path={route.path.substring(1)}
              element={
                <ProtectedRoute isAllowed={isScriptIDPresent}>
                  <Component />
                </ProtectedRoute>
              }
            />
          );
        })}
      </Route>
      <Route
        key='/pos'
        path="pos"
        element={
          <ProtectedRoute isAllowed={isScriptIDPresent}>
            <POSPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;