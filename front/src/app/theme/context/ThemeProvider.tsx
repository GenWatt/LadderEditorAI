import { darkThemeColors, lightThemeColors } from "@/shared/editor/styles/colors";
import { createContext, useContext, useEffect, useState } from "react";
// Assuming your colors are here, adjust the path if necessary


// Define a type for the color object structure
// This assumes darkThemeColors and lightThemeColors have the same keys
type ThemeColors = typeof darkThemeColors;

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "dark" | "light";
    activeColors: ThemeColors;
};

// Initial state for the context (primarily for type safety and fallback)
// The actual values will be dynamically provided by the ThemeProvider's state.
const initialResolvedTheme = typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    resolvedTheme: initialResolvedTheme,
    activeColors: initialResolvedTheme === "dark" ? darkThemeColors : lightThemeColors,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );

    // State for the resolved theme (actual "dark" or "light" being used)
    const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
        const initialTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
        if (initialTheme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        return initialTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        let currentAppliedTheme: "dark" | "light";
        if (theme === "system") {
            currentAppliedTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
        } else {
            currentAppliedTheme = theme;
        }

        root.classList.add(currentAppliedTheme);
        setResolvedTheme(currentAppliedTheme);

        // Listener for system theme changes if the current theme is 'system'
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = (e: MediaQueryListEvent) => {
                const newSystemTheme = e.matches ? "dark" : "light";
                root.classList.remove("light", "dark"); // remove old
                root.classList.add(newSystemTheme);     // add new
                setResolvedTheme(newSystemTheme);       // update state
            };
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]); // Re-run when the user's preferred theme changes

    const activeColors = resolvedTheme === "dark" ? darkThemeColors : lightThemeColors;

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
        resolvedTheme,
        activeColors,
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context; // Now includes resolvedTheme and activeColors
};