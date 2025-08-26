"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button className="p-2 rounded" title="Light"><Sun size={16} /></button>
        <button className="p-2 rounded" title="Dark"><Moon size={16} /></button>
        <button className="p-2 rounded" title="System"><Monitor size={16} /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        aria-pressed={theme === "light"}
        className={`p-2 rounded ${effectiveTheme === "light" ? "bg-secondary" : ""}`}
        onClick={() => setTheme("light")}
        title="Light"
      >
        <Sun size={16} />
      </button>
      <button
        aria-pressed={theme === "dark"}
        className={`p-2 rounded ${effectiveTheme === "dark" ? "bg-secondary" : ""}`}
        onClick={() => setTheme("dark")}
        title="Dark"
      >
        <Moon size={16} />
      </button>
      <button
        aria-pressed={theme === "system"}
        className={`p-2 rounded ${theme === "system" ? "bg-secondary" : ""}`}
        onClick={() => setTheme("system")}
        title="System"
      >
        <Monitor size={16} />
      </button>
    </div>
  );
}
