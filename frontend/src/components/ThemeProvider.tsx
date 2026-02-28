"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(isDark: boolean) {
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    applyTheme(theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
