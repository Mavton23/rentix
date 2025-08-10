import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
          theme === 'light'
            ? 'bg-white shadow-md text-indigo-600 dark:text-indigo-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
          theme === 'dark'
            ? 'bg-gray-700 shadow-md text-indigo-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
          theme === 'system'
            ? 'bg-gray-200 dark:bg-gray-600 shadow-md text-indigo-600 dark:text-indigo-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
        }`}
        aria-label="System preference"
      >
        <Monitor className="w-5 h-5" />
      </button>
    </div>
  );
};