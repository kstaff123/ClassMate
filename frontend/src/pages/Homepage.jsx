import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";
import { Schedule } from "../components/Schedule";

export function Homepage() {
    return(
        <main class="font-primary font-bold text-2xl bg-gray-100 h-screen overflow-hidden flex-col flex">
            <div class="flex-none">
                <Header/>
            </div>
            <div class="grid grid-cols-3 items-center grid-flow-col flex-grow px-8 gap-x-8 " >
                <div class="bg-white col-span-2 w-full h-[87.5vh] max-h-7/8 rounded-4xl shadow-xl">
                    <div class="flex flex-col p-4 max-h-full">
                        <h2 class="text-2xl font-medium">Schedule</h2>
                        <div id="scrollable-container" className="mx-.9 overflow-y-scroll overflow-x-hidden">
                            <Schedule/>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="bg-white col-span-1 w-full h-[87.5vh] max-h-7/8 rounded-4xl shadow-xl">
                    <div class="flex items-center p-4">
                        <h2 class="text-2xl font-medium">Class Cart</h2>
                    </div>
                </div>
            </div>
        </main>
    );
}
