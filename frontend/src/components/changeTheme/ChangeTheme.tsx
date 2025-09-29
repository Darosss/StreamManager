import { useLocalStorage } from "@hooks";
import React, { useEffect } from "react";

export default function ChangeTheme() {
  const [theme, setTheme] = useLocalStorage("theme", "");

  useEffect(() => {
    if (theme) return;
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode) {
      setTheme("dark");
    }
  }, [theme, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button className={`common-button`} onClick={handleThemeChange}>
      {theme === "light" ? "🔆" : "🌑"}
    </button>
  );
}
