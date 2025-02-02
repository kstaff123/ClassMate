import "../App.css";
import { useState } from "react";

export function Header(){
    return(
        <header class="bg-gray-800 text-white w-full h-16 flex items-center justify-start px-4 ">
            <h1 class="text-center">ClassMate</h1>
        </header>
    );
}