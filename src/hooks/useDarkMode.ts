import { useState, useEffect } from 'react';

export function useDarkMode() {
  console.log('🌙 useDarkMode: Hook initialized');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    console.log('🌙 useDarkMode: Loaded from localStorage:', saved);
    return saved === 'true';
  });

  useEffect(() => {
    console.log('🌙 useDarkMode: Dark mode changed to:', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log('🌙 toggleDarkMode: Toggling dark mode');
    setDarkMode(!darkMode);
  };

  return { darkMode, toggleDarkMode };
}
