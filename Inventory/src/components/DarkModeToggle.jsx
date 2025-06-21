import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { GlobalContext } from '../context/AppContext';

const DarkModeToggle = ({size}) => {
  const {setDarkMode,darkMode} = React.useContext(GlobalContext);

  useEffect(() => {
    if (darkMode) { 
      document.documentElement.classList.add('dark');
      sessionStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      sessionStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => {setDarkMode(!darkMode)}}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:scale-105 transition-all"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? <Sun className="text-yellow-400" size={size}/> : <Moon className="text-gray-800" size={size}/>}
    </button>
  );
};

export default DarkModeToggle;
