"use client";

import React, { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    try {
      if (localStorage.getItem("sih_theme") === "light") {
        localStorage.removeItem("sih_theme");
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

