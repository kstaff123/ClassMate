import "../App.css";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine the active page based on the current path.
    const activePage = location.pathname === "/CourseBrowser" ? "coursebrowser" : "dashboard";

    return (
        <header className="bg-white w-full h-16 grid grid-cols-3 px-4 items-center">
            <h1 className="text-center font-medium text-black justify-self-start">
                ClassMate
            </h1>
            <div className="text-xl flex items-center space-x-4 justify-center">
                <div
                    className={`${
                        activePage === "dashboard"
                            ? "bg-[#173E82] w-fit h-fit rounded-4xl text-white flex-nowrap"
                            : ""
                    }`}
                >
                    <button
                        onClick={() => {
                            navigate("/");
                        }}
                        className="font-medium flex-nowrap p-2 whitespace-nowrap"
                    >
                        Dashboard
                    </button>
                </div>
                <div
                    className={`${
                        activePage === "coursebrowser"
                            ? "bg-[#173E82] w-fit h-fit rounded-4xl text-white flex-nowrap"
                            : ""
                    }`}
                >
                    <button
                        onClick={() => {
                            navigate("/CourseBrowser");
                        }}
                        className="font-medium flex-nowrap p-2 whitespace-nowrap"
                    >
                        Class Browser
                    </button>
                </div>
            </div>
            <div className="text-sm font-medium ml-4 justify-self-end">
                <h2>login</h2>
            </div>
        </header>
    );
}
