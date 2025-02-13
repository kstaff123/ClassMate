import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Header(){
    const navigate = useNavigate();
    return(
        <header className="bg-white text-white w-full h-16 grid grid-cols-3 px-4 items-center">
            <h1 className="text-center font-medium text-black justify-self-start">ClassMate</h1>
            <div className=" text-xl flex items-center space-x-4 justify-center">
                <div className="bg-[#173E82] w-fit h-fit p-2 rounded-4xl">
                    <button onClick={() => navigate('/')} className="text-white">Dashboard</button>
                </div>
                <button onClick={() => navigate('/CourseBrowser')} className="text-black font-medium flex-nowrap">Class Browser</button>
            </div>
            <div className="text-black text-sm font-medium ml-4 justify-self-end">
                <h2 className="">login</h2>
                </div>
            
            
        </header>
    );
}