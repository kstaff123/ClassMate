import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";
import { Schedule } from "../components/Schedule";
import { Cart } from "../components/Cart";
import { CartMobile } from "../components/CartMobile";
import { MobileSchedule } from "../components/MobileSchedule";

export function Homepage() {
  const [isCartOpen, openCart] = useState(false);

  const toggleCart = () => {
    openCart((prev) => !prev);
  };

  return (
    <main className="font-primary font-bold text-2xl bg-gray-100 h-screen overflow-hidden flex-col flex">
      <div className="flex-none z-30">
        <Header />
      </div>
      {isCartOpen && <CartMobile onClose={toggleCart} />}
      <div className="grid grid-cols-3 items-center grid-flow-col flex-grow sm:px-8  gap-x-8 max-lg:grid-cols-1">
        <div className="bg-white col-span-2 w-full h-[100vh] sm:h-[87.5vh] max-sm:m-0 sm:max-h-7/8 rounded-2xl sm:rounded-4xl shadow-xl overflow-hidden">
          <div className="flex flex-col sm:p-4 max-h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl max-sm:p-4 font-medium max-sm:justify-self-center">
                Schedule
              </h2>
              <button
                id="menu-btn"
                className="stroke-black  hover:stroke-blue-300 flex font-medium hover:text-blue-300 text-base  transition-all ease-in-out items-center justify-center lg:hidden focus:outline-none hover:cursor-pointer"
                onClick={toggleCart}
              >
                <svg
                  className="mr-2 "
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p className="max-sm:hidden">Class Cart</p>
              </button>
            </div>
            <div
              id="scrollable-container"
              className="mx-.9 overflow-y-scroll overflow-x-hidden rounded-xl h-full sm:h-auto max-sm:hidden"
            >
              <Schedule />
            </div>
            <div className="sm:hidden flex items-center h-[calc(100vh-127px)]">
              <MobileSchedule />
            </div>
          </div>
        </div>
        <div className="bg-white col-span-1 w-full h-[87.5vh] max-h-7/8 rounded-4xl shadow-xl max-lg:hidden">
          <div className="flex p-4 flex-col">
            <h2 className="text-2xl font-medium">Class Cart</h2>
            <div className="">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
