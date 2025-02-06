import "../App.css";
import { useState } from "react";
import { Header } from "../components/Header";
import { fetchCourseList } from "../apis/courseFetcher";

export function Homepage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchCourses = async () => {
        setLoading(true); // Start loading
        const data = await fetchCourseList(); // Fetch API data
        setClasses(data?.data || []); // Store response in state
        setLoading(false); // Stop loading
    };

    return (
        <main className="font-primary font-bold text-2xl bg-gray-100 h-screen flex-col flex">
            <div className="flex-none">
                <Header />
            </div>
            <div className="grid grid-cols-3 items-center grid-flow-col flex-grow p-8 gap-x-8">
                <div className="bg-white col-span-2 w-full h-7/8 rounded-4xl shadow-xl p-4">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-medium pr-2">Schedule</h2>
                        <h2 class="font-light">|</h2>
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
                        </button>
                    </div>
                    
                    <div className="py-1 flex-row items-center">
                        {/* Button with synchronized text and arrow fade */}
                        
                        <hr class="text-gray-300"></hr>
                        <div class= "w-fit h-fit">
                            
                            <div class="font-semibold text-base py-2">
                            {!loading && classes.length > 0 && (
                        <ul className="mt-4">
                            {classes.map((course) => (  
                                <li key={course.id} className="p-2 border-b">
                                    <div className="font-medium">{course.title} - {course.subject}</div>
                                    <div class="flex flex-col">
                                        <h1></h1>
                                    </div>
                                </li>
                            ))}
                        </ul>
                            )}
                            </div>
                            
                        </div>

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
