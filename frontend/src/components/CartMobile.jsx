import "../App.css";
import { Cart } from "../components/Cart";
import { useState, useEffect } from "react";

export function CartMobile({ onClose }) {
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Tailwind's lg breakpoint is 1024px
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex backdrop-blur-sm items-center justify-center z-20"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-4xl shadow-lg w-96 text-center relative min-h-[50vh]">
        <div className="flex items-center justify-center">
            <h2 className="text-xl font-medium">Class Cart</h2>
            <button
              className="absolute right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={onClose}
            >
              &times;
            </button>
        </div>
        <div className="flex items-center justify-center max-h-[60vh]">
            <Cart />
        </div>
      </div>
    </div>
  );
}