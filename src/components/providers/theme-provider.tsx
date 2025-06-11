import * as React from "react";
import { ColorMoodProvider } from "@/hooks/use-color-mood";

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<string>(defaultTheme);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || defaultTheme;
    let resolvedTheme = savedTheme;

    if (enableSystem && savedTheme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    setTheme(resolvedTheme);

    if (attribute === "class") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolvedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    }
  }, [defaultTheme, enableSystem, attribute]);

  React.useEffect(() => {
    if (enableSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const savedTheme = localStorage.getItem("theme") || defaultTheme;
        if (savedTheme === "system") {
          const newTheme = mediaQuery.matches ? "dark" : "light";
          setTheme(newTheme);

          if (attribute === "class") {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(newTheme);
          } else {
            document.documentElement.setAttribute("data-theme", newTheme);
          }
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [enableSystem, defaultTheme, attribute]);

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      localStorage.setItem("theme", newTheme);
      let resolvedTheme = newTheme;

      if (enableSystem && newTheme === "system") {
        resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }

      setTheme(resolvedTheme);

      if (attribute === "class") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(resolvedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", resolvedTheme);
      }
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      <ColorMoodProvider>{children}</ColorMoodProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
