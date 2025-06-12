import { Toaster as Sonner } from "sonner";
import * as React from "react";
import { STORAGE_KEYS, MOOD_CONFIG } from "@/lib/config";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    MOOD_CONFIG.defaultTheme as "light" | "dark" | "system"
  );

  React.useEffect(() => {
    const savedTheme =
      localStorage.getItem(STORAGE_KEYS.theme) || MOOD_CONFIG.defaultTheme;
    let resolvedTheme: "light" | "dark" = "light";

    if (savedTheme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      resolvedTheme = savedTheme as "light" | "dark";
    }

    setTheme(resolvedTheme);
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
