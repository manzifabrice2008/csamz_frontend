import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Get system theme preference
  const getSystemTheme = (): "light" | "dark" => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  // Apply theme to document
  const applyTheme = (themeToApply: "light" | "dark") => {
    const root = document.documentElement;
    if (themeToApply === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setResolvedTheme(themeToApply);
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(savedTheme);

    if (savedTheme === "system") {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme(savedTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Update theme when changed
  useEffect(() => {
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-5 w-5" />;
    }
    return resolvedTheme === "light" ? (
      <Sun className="h-5 w-5" />
    ) : (
      <Moon className="h-5 w-5" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Toggle theme"
          className="relative hover:bg-accent transition-colors"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mb-1">
          Choose Theme
        </div>
        
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={`cursor-pointer rounded-md px-3 py-2 flex items-center gap-3 transition-colors ${
            theme === "light" 
              ? "bg-school-primary text-white dark:bg-school-accent" 
              : "hover:bg-accent"
          }`}
        >
          <Sun className="h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium">Light</span>
            <span className={`text-xs ${theme === "light" ? "text-white/80" : "text-muted-foreground"}`}>
              Bright theme
            </span>
          </div>
          {theme === "light" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-white" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={`cursor-pointer rounded-md px-3 py-2 flex items-center gap-3 transition-colors ${
            theme === "dark" 
              ? "bg-school-primary text-white dark:bg-school-accent" 
              : "hover:bg-accent"
          }`}
        >
          <Moon className="h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium">Dark</span>
            <span className={`text-xs ${theme === "dark" ? "text-white/80" : "text-muted-foreground"}`}>
              Dark theme
            </span>
          </div>
          {theme === "dark" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-white" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className={`cursor-pointer rounded-md px-3 py-2 flex items-center gap-3 transition-colors ${
            theme === "system" 
              ? "bg-school-primary text-white dark:bg-school-accent" 
              : "hover:bg-accent"
          }`}
        >
          <Monitor className="h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium">System</span>
            <span className={`text-xs ${theme === "system" ? "text-white/80" : "text-muted-foreground"}`}>
              Auto (Default)
            </span>
          </div>
          {theme === "system" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-white" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
