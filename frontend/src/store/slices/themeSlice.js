import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('idpl_admin_theme');

  if (savedTheme) {
    return savedTheme === 'dark';
  }

  return window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
};

const themeSlice = createSlice({
  name: 'theme',

  initialState: {
    isDarkMode: getInitialTheme(),
  },

  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },

    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
