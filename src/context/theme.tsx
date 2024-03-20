import React, { createContext, useEffect, useState } from "react";

interface ThemeContextProps {
  theme: string;
  setTheme: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  setTheme: () => {},
});

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const valueToShare = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={valueToShare}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
