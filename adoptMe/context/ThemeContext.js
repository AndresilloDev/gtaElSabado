import React, { createContext, useState, useEffect, useContext } from "react";
import { Appearance } from "react-native";

const lightTheme = {
  background: "#ffffff",
  textColor: "#000000",
  buttonBackground: "#00205B",
  inputBackground: "#ffffff",
  buttonText: "#ffffff",
  interestCard: "ffffff"
};

const darkTheme = {
  background: "#1A1A1A",
  textColor: "#ffffff",
  buttonBackground: "#00205B",
  inputBackground: "#333333",
  buttonText: "#ffffff",
  interestCard: "00205B"
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    const listener = ({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    };
    const subscription = Appearance.addChangeListener(listener);
    
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};