import { useState } from "react";


export function CourseSearch() {

    //search state
    const [searchInput, setSearchInput] = useState("");
    const handleSearch = () => {
        console.log("Searching for:", searchInput);
    };

    //loading filters
    fetch('./json/courseAttributes.json')
    .then(response => response.json())
    .then(data => {
        const gurAttributes = data.gurAttributes;
    });



  return (
    <div>
      <div className="bg-gray-200 text-stone-700 group border-none outline-none w-[400px] min-w-[100px] h-10 my-4 rounded-lg flex items-center">
          <input
            placeholder="All Courses"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="w-full max-w-full flex h-full rounded-3xl group placeholder:text-stone-400 group-hover:placeholder:text-stone-500 group-focus-within:placeholder:text-stone-500 bg-transparent border-none outline-none text-lg font-normal px-4 placeholder:transition-all ease-in-out"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 mx-2 stroke-neutral-400 group-hover:stroke-neutral-500 group-focus-within:stroke-neutral-500  hover:stroke-neutral-600 transition-all ease-in-out hover:cursor-pointer stroke-2 flex-shrink-0"
            onClick={handleSearch} // Trigger search on click
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>


    </div>
  );
}
