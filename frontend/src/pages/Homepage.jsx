import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";

export function Homepage() {
    return(
        <main class="font-primary font-bold text-2xl bg-gray-100 h-screen flex-col flex">
            <div class="flex-none">
                <Header/>
            </div>
            <div class="grid grid-cols-3 items-center grid-flow-col flex-grow p-8 gap-x-8 " >
                <div class="bg-white col-span-2 w-full h-7/8 rounded-4xl shadow-xl"></div>
                <div class="bg-white col-span-1 w-full h-7/8 rounded-4xl shadow-xl"></div>
            </div>
        </main>
    );
}