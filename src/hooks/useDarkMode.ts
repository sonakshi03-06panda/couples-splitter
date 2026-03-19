import { useState, useEffect } from 'react';

/**
 * Custom hook for managing dark mode state with localStorage persistence
 * @returns {Object} { isDarkMode: boolean, toggleDarkMode: () => void, isLoaded: boolean }
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = storedDarkMode !== null ? storedDarkMode === 'true' : prefersDark;

    setIsDarkMode(shouldBeDark);
    applyDarkMode(shouldBeDark);
    setIsLoaded(true);
  }, []);

  // Apply dark mode to document
  const applyDarkMode = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
  };

  // Toggle dark mode and persist to localStorage
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newState = !prev;
      localStorage.setItem('dark-mode', JSON.stringify(newState));
      applyDarkMode(newState);
      return newState;
    });
  };

  return {
    isDarkMode,
    toggleDarkMode,
    isLoaded,
  };
}
