import React, { useState, useEffect, createContext, lazy, Suspense } from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const ThemeToggle = lazy(() => import('./components/ThemeToggle'));

// Create theme context
export const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {}
});

// Background floating particles
const FloatingParticles = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${isDark ? 'bg-purple-600/10' : 'bg-purple-500/5'} blur-3xl animate-float-slow`}></div>
      <div className={`absolute top-3/4 left-2/3 w-96 h-96 rounded-full ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'} blur-3xl animate-float-slow-reverse`}></div>
      <div className={`absolute top-1/2 left-1/3 w-72 h-72 rounded-full ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-500/5'} blur-3xl animate-float`}></div>
    </div>
  );
};

// Scroll progress indicator
const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Throttle scroll events for performance
  useEffect(() => {
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          setScrollProgress(lastKnownScrollPosition / totalHeight);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
        style={{ width: `${scrollProgress * 100}%` }}
      ></div>
    </div>
  );
};

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#12082e] to-[#240f54]">
    <div className="text-white text-xl flex flex-col items-center">
      <svg className="animate-spin h-10 w-10 mb-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </div>
  </div>
);

// Theme toggle button component
const ThemeToggleButton = ({ isDark, toggleTheme }) => {
  // Memoized toggle to prevent unnecessary re-renders
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-300">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-700">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

// Main App component
function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Handle theme toggle with debounce to prevent rapid state changes
  const toggleTheme = () => {
    setIsDark((prevIsDark) => !prevIsDark);
  };

  // Apply theme class to document root
  useEffect(() => {
    // Check for user's preferred theme in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: isdark)').matches;

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else if (prefersDark !== undefined) {
      setIsDark(prefersDark);
    }
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <AuthProvider>
        {/* Background particles for visual interest - fewer on mobile */}
        <FloatingParticles isDark={isDark} />

        {/* Scroll progress indicator */}
        <ScrollIndicator />

        {/* Theme toggle button - z-index 40 to appear below modals */}
        <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />

        {/* Main content */}
        <Suspense fallback={<LoadingFallback />}>
          <div className="relative z-10">
            <Dashboard />
          </div>
        </Suspense>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;