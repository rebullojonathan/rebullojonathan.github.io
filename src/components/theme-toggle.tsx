import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("portfolio-theme");
    } catch {
      // Storage can be blocked (private mode, sandboxed previews); fall back to dark.
    }
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      // Preference just won't persist when storage is unavailable.
    }
  }

  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="click-effect shrink-0"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
