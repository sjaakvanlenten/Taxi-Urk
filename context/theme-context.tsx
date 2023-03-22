import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { light, dark, Theme } from "../themes/theme";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => Dispatch<SetStateAction<Theme>> | void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: light,
  toggleTheme: () => {},
});

// Create a theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(light);

  // Toggle the theme
  const toggleTheme = () => {
    setTheme(theme === light ? dark : light);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
