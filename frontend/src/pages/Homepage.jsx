import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";
import { Schedule } from "../components/Schedule";
import { Cart } from "../components/Cart";
import { CartMobile } from "../components/CartMobile";

export function Homepage() {
  const [isCartOpen, openCart] = useState(false);

  const toggleCart = () => {
    openCart((prev) => !prev);
  };

  return (

    <main class="font-primary font-bold text-2xl bg-gray-100 h-screen overflow-hidden flex-col flex">

      <div class="flex-none z-30">
        <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
      </div>
      {isCartOpen && <CartMobile />}
      <div class="grid grid-cols-3 items-center grid-flow-col flex-grow px-8 gap-x-8 max-md:grid-cols-1">
        <div class="bg-white col-span-2 w-full h-[87.5vh] max-sm:m-0 max-h-7/8 rounded-4xl shadow-xl">
          <div class="flex flex-col p-4 max-h-full">
            <h2 class="text-2xl font-medium">Schedule</h2>
            <div
              id="scrollable-container"
              className="mx-.9 overflow-y-scroll overflow-x-hidden rounded-xl"
            >
              <Schedule />
            </div>
          </div>
        </div>
        <div class="bg-white col-span-1 w-full h-[87.5vh] max-h-7/8 rounded-4xl shadow-xl max-md:hidden">
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
