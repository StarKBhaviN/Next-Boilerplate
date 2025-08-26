"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "app-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");

  // Load saved theme
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system";
    setTheme(saved);
  }, []);

  const effectiveTheme = useMemo(() => {
    return theme === "system" ? getSystemTheme() : theme;
  }, [theme]);

  // Apply class to html element for Tailwind CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", effectiveTheme === "dark");
  }, [effectiveTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, effectiveTheme, setTheme: (t) => {
      setTheme(t);
      try { localStorage.setItem(THEME_STORAGE_KEY, t); } catch {}
    } }),
    [theme, effectiveTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


