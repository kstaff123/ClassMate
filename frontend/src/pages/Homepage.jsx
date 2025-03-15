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
      <div className="grid grid-cols-3 items-center grid-flow-col flex-grow shortorsmall:px-8  shortorsmall:gap-x-8 max-lg:grid-cols-1">
        <div className="bg-white col-span-2 w-full h-[100vh] shortorsmall:h-[87.5vh] max-sm:m-0 shortorsmall:max-h-7/8  shortorsmall:rounded-4xl shadow-xl overflow-hidden">
          <div className="flex flex-col shortorsmall:p-4 max-h-full">
            <div className="flex items-center p-0 anysizeshort:pt-4 max-xl:pt-4 anysizeshort:px-4 max-xl:px-4 justify-between">
              <h2 className="shortorsmall:text-2xl font-medium text-base">
                Schedule
              </h2>
              <button
                id="menu-btn"
                className="stroke-black  hover:stroke-blue-300 flex font-medium hover:text-blue-300 text-base  transition-all ease-in-out items-center justify-center lg:hidden focus:outline-none hover:cursor-pointer"
                onClick={toggleCart}
              >
                <svg
                  className="sm:mr-2 mr-4"
                  width="18"
                  height="18"
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
            <hr className="text-gray-300 mb-4 max-xl:mx-4 px-4"></hr>
            <div
              id="scrollable-container"
              className="mx-.9 overflow-y-scroll overflow-x-hidden  h-full sm:h-[calc(100vh-120px)] max-sm:hidden"
            >
              <Schedule />
            </div>
            <div className="sm:hidden flex items-center h-[calc(100vh-120px)]">
              <MobileSchedule />
            </div>
          </div>
        </div>
        <div className="bg-white col-span-1 w-full h-full shortorsmall:h-[87.5vh] shortorsmall:max-h-7/8 shortorsmall:rounded-4xl shadow-xl max-lg:hidden">
          <div className="flex p-4 flex-col">
            <h2 className="shortorsmall:text-2xl font-medium text-base ">
              Class Cart
            </h2>
            <hr className="text-gray-300 pb-1"></hr>
            <div className="">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
