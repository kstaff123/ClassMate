import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";
import { fetchCourseList } from "../apis/courseFetcher";
import { CourseSearch } from "../components/CourseSearch";
import { Cart } from "../components/Cart";

export function CourseBrowser() {

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchCourses = async () => {
        setLoading(true); // Start loading
        const data = await fetchCourseList(); // Fetch API data
        setClasses(data?.data || []); // Store response in state
        setLoading(false); // Stop loading
    };
        return (
            <main className="font-primary font-bold text-2xl bg-gray-100 h-screen flex-col overflow-hidden flex">
                <div className="flex-none">
                    <Header />
                </div>
                <div className="grid grid-cols-3 items-center grid-flow-col flex-grow px-8 gap-x-8 max-h-screen">
                    <div className="bg-white col-span-2 w-full h-[87.5vh] max-h-7/8 rounded-4xl shadow-xl p-4 ">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-medium pr-2">Browse Classes</h2>
                            {/*
                            <h2 className="font-light">|</h2>
                            <button 
                                className="flex items-center gap-2 w-fit h-fit pl-2 text-black font-normal text-2xl transition-all duration-200 ease-in-out cursor-pointer group hover:text-blue-300"
                                onClick={handleFetchCourses}
                            >
                                <span className="transition-all duration-200 ease-in-out group-hover:text-blue-300">
                                    Load Course List
                                </span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className="size-6 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 group-hover:-translate-x-1 group-hover:text-blue-300"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                </svg>
                            </button> */}
                            
                        </div>
                        <hr class="text-gray-300 pb-1"></hr>
                        <div className="py-1 flex-row items-center">
                            <CourseSearch/>
                        </div>

                    </div>
                    <div className="bg-white col-span-1 w-full h-7/8 rounded-4xl shadow-xl">
                        <div className="flex p-4 flex-col">
                            <h2 className="text-2xl font-medium">Class Cart</h2>
                            <div className="">
                                <Cart/>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </main>
    );
}
 