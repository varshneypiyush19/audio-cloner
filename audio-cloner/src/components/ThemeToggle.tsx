import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 p-2 rounded-lg 
                bg-slate-200 dark:bg-white/10 
                text-slate-800 dark:text-white 
                border border-slate-300 dark:border-white/20"
    >
      {darkMode ? '🌞' : '🌙'}
    </button>
  );
}; 