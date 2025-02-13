import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";

export function Homepage() {
    return (
        <main className="font-primary font-bold text-2xl bg-gray-100 h-screen flex-col flex">
            <div className="flex-none">
                <Header />
            </div>
            <div className="grid grid-cols-3 items-center grid-flow-col flex-grow p-8 gap-x-8">
                <div className="bg-white col-span-2 w-full h-7/8 rounded-4xl shadow-xl p-4">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-medium pr-2">Schedule</h2>
                    </div>
                </div>
                <div className="bg-white col-span-1 w-full h-7/8 rounded-4xl shadow-xl">
                    <div className="flex items-center p-4">
                        <h2 className="text-2xl font-medium">Class Cart</h2>
                    </div>
                </div>
            </div>
        </main>
    );
}
