import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeBootstrap = ({ children }) => {
  const isDarkMode = useSelector(
    (state) => state.theme.isDarkMode
  );

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('idpl_admin_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('idpl_admin_theme', 'light');
    }
  }, [isDarkMode]);

  return children;
};

export default ThemeBootstrap;
