import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";

export function Homepage() {
    return(
        <main class="font-primary font-bold text-2xl">
            <div class="flex">
                <Header/>
            </div>
        </main>
    );
}