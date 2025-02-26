import { createContext, useContext, useState } from "react";

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the cart
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add course to the cart (prevents duplicates)
  const addToCart = (course) => {
    setCart((prevCart) => {
      const exists = prevCart.some((item) => item.id === course.id);
      return exists ? prevCart : [...prevCart, course];
    });
  };

  // Remove course from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
