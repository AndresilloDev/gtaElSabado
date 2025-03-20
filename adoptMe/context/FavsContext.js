import React, { createContext, useContext, useState } from "react";

const FavsContext = createContext();

export const useFavs = () => useContext(FavsContext);

export const FavsProvider = ({ children }) => {
  const [favs, setFavs] = useState([]);

  const toggleFavs = (mascota) => {
    setFavs((prev) => {
      const existe = prev.some((fav) => fav.id === mascota.id);
      return existe ? prev.filter((fav) => fav.id !== mascota.id) : [...prev, mascota];
    });
  };

  return (
    <FavsContext.Provider value={{ favs, toggleFavs }}>
      {children}
    </FavsContext.Provider>
  );
};
