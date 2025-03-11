import { createContext, useContext, useState } from "react";

// 1) Create our Cart Context
const CartContext = createContext();

// 2) Hook to use the cart context
export const useCart = () => useContext(CartContext);

// 3) Pool of possible Tailwind color classes (-400 variants)
const COLOR_POOL = [
  "bg-red-400",
  "bg-teal-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-rose-400",
];

export const CartProvider = ({ children }) => {
  // Our cart array, each item is a "course" object
  const [cart, setCart] = useState([]);

  // (courseId => tailwindColorClass)
  const [courseColors, setCourseColors] = useState({});
  // Remaining colors not assigned yet
  const [availableColors, setAvailableColors] = useState([...COLOR_POOL]);

  // Add course to cart if not already present
  const addToCart = (course) => {
    setCart((prevCart) => {
      const exists = prevCart.some((item) => item.id === course.id);
      if (exists) {
        return prevCart; // no duplicates
      }
      // Otherwise, we add the course
      // 1) Pick a color for it if it doesn't already have one
      setCourseColors((prevColors) => {
        // Already assigned? (In case you re-add a course)
        if (prevColors[course.id]) {
          return prevColors;
        }
        // Otherwise pick from the available pool
        const newColors = { ...prevColors };
        setAvailableColors((prevAvail) => {
          if (prevAvail.length === 0) {
            // fallback color if pool is exhausted
            newColors[course.id] = "bg-slate-400";
            return prevAvail;
          }
          // pick a random color
          const randIndex = Math.floor(Math.random() * prevAvail.length);
          const [chosen] = prevAvail.splice(randIndex, 1);
          newColors[course.id] = chosen;
          return prevAvail;
        });
        return newColors;
      });
      // 2) Return the updated cart
      return [...prevCart, course];
    });
  };

  // Remove course from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    // Also free up the color
    setCourseColors((prevColors) => {
      const copy = { ...prevColors };
      const usedColor = copy[id];
      if (usedColor) {
        setAvailableColors((prevAvail) => [...prevAvail, usedColor]);
      }
      delete copy[id];
      return copy;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        courseColors, // Expose the color map so other components can read it
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
