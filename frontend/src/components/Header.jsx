import "../App.css";
import { useState } from "react";

export function Header(){
    return(
        <header class="bg-white text-white w-full h-16 grid grid-cols-3 px-4 items-center">
            <h1 class="text-center font-medium text-black justify-self-start">ClassMate</h1>
            <div class=" text-xl flex items-center space-x-4 justify-center">
                <div class="bg-[#173E82] w-fit h-fit p-2 rounded-4xl">
                    <h1 class="text-white">Dashboard</h1>
                </div>
                <h1 class="text-black font-medium">Class Browser</h1>
            </div>
            <div class="text-black text-sm font-medium ml-4 justify-self-end">
                <h2 class="">login</h2>
                </div>
            
            
        </header>
    );
}