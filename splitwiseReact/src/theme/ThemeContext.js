import React, { createContext, useContext } from 'react';
import { darkTheme } from './theme';

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={darkTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
