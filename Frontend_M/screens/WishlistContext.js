import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [refreshContext, setRefresh] = useState(1);

  const refreshWishlistContext = () => {
    setRefresh(refreshContext + 1);
  };

  return (
    <WishlistContext.Provider
      value={{ refreshContext, refreshWishlistContext }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
