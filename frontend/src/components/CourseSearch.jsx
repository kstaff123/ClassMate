import { useState } from "react";
import Select from "react-select";
import courseAttributes from "../json/courseAttributes.json";
import instructorList from "../json/instructors.json";
import { fetchCourseList } from "../apis/courseFetcher";
import CopyPopover from "./CopyPopover";
import { useCart } from "./CartContext";

export function CourseSearch() {
  const { addToCart } = useCart();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedGUR, setSelectedGUR] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const daysOfWeek = [
    { key: "monday", label: "M" },
    { key: "tuesday", label: "T" },
    { key: "wednesday", label: "W" },
    { key: "thursday", label: "T" },
    { key: "friday", label: "F" },
  ];
  const handleSearch = async () => {
    setLoading(true);

    try {
      const data = await fetchCourseList();
      let filteredClasses = data?.data || [];

      console.log(
        "Raw API Response:",
        JSON.stringify(filteredClasses, null, 2)
      ); // Log full response

      // Filter by title if searchInput is provided
      if (searchInput) {
        filteredClasses = filteredClasses.filter((course) =>
          course.title.toLowerCase().includes(searchInput.toLowerCase())
        );
      }

      // Filter by GUR attribute if selectedGUR is set
      if (selectedGUR && selectedGUR.value) {
        console.log("Selected GUR:", selectedGUR.value);
        filteredClasses = filteredClasses.filter((course) => {
          // Safely check if class_attributes exists
          if (
            course.class_attributes &&
            Array.isArray(course.class_attributes)
          ) {
            return course.class_attributes.some((attr) => {
              console.log(
                "Checking Attribute:",
                attr?.attribute?.attribute_code
              );
              return attr?.attribute?.attribute_code === selectedGUR.value;
            });
          }
          return false; // Skip courses without valid class_attributes
        });
      }

      // Filter by Subject if selectedSubject is set
      if (selectedSubject && selectedSubject.value) {
        filteredClasses = filteredClasses.filter(
          (course) => course.subject === selectedSubject.value
        );
      }

      // Filter by Delivery attribute if selectedDelivery is set
      if (selectedDelivery && selectedDelivery.value) {
        console.log("Selected GUR:", selectedDelivery.value);
        filteredClasses = filteredClasses.filter((course) => {
          // Safely check if class_attributes exists
          if (
            course.class_attributes &&
            Array.isArray(course.class_attributes)
          ) {
            return course.class_attributes.some((attr) => {
              console.log(
                "Checking Attribute:",
                attr?.attribute?.attribute_code
              );
              return attr?.attribute?.attribute_code === selectedDelivery.value;
            });
          }
          return false; // Skip courses without valid class_attributes
        });
      }

      console.log(
        "Filtered Classes:",
        JSON.stringify(filteredClasses, null, 2)
      ); // Log filtered results

      setClasses(filteredClasses);
    } catch (error) {
      console.error("Error during filtering:", error);
      setClasses([]); // Clear the class list on error
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-nowrap w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between gap-4 flex-nowrap min-w-fit">
          <div className="flex flex-col w-96">
            <h1 className="text-sm font-medium">
              <span>&#8203;</span>
            </h1>
            {/* Search bar */}
            <div className="bg-gray-200 text-stone-700 group border-none outline-none w-full h-10 rounded-lg flex items-center">
              <input
                placeholder="Class Title or CRN"
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
                className="size-6 mx-2 stroke-neutral-400 group-hover:stroke-neutral-500 group-focus-within:stroke-neutral-500 hover:stroke-neutral-600 transition-all ease-in-out hover:cursor-pointer stroke-2 flex-shrink-0"
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

          {/* Filter Form */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-4">
              {/*GUR Attribute*/}
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">GUR Attribute</h1>
                <Select
                  isSearchable="false"
                  placeholder=""
                  className={"react-select-container"}
                  classNamePrefix={"react-select"}
                  options={courseAttributes["gurAttributes"]}
                  onChange={setSelectedGUR}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Subject</h1>
                <Select
                  isSearchable="false"
                  placeholder=""
                  className={"react-select-container"}
                  classNamePrefix={"react-select"}
                  options={courseAttributes["subjects"]}
                  onChange={setSelectedSubject}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/*GUR Attribute*/}
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Instructor</h1>
                <Select
                  isSearchable="false"
                  placeholder=""
                  className={"react-select-container"}
                  classNamePrefix={"react-select"}
                  options={instructorList["instructors"]}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Delivery Method</h1>
                <Select
                  isSearchable="false"
                  placeholder=""
                  className={"react-select-container"}
                  classNamePrefix={"react-select"}
                  options={courseAttributes["deliveryMethods"]}
                  onChange={setSelectedDelivery}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col w-[191px]">
                {" "}
                {/* Days */}
                <h1 className="font-medium text-sm">Days</h1>
                <div className="flex space-x-4 border border-gray-300 rounded-sm p-1 justify-around">
                  <label className="flex flex-col text-xs items-center font-medium">
                    M<input className="size-3" type="checkbox"></input>
                  </label>
                  <label className="flex flex-col text-xs items-center font-medium">
                    T<input className="size-3" type="checkbox"></input>
                  </label>
                  <label className="flex flex-col text-xs items-center font-medium">
                    W<input className="size-3" type="checkbox"></input>
                  </label>
                  <label className="flex flex-col text-xs items-center font-medium">
                    T<input className="size-3" type="checkbox"></input>
                  </label>
                  <label className="flex flex-col text-xs items-center font-medium">
                    F<input className="size-3" type="checkbox"></input>
                  </label>
                </div>
              </div>
              <div className="flex-col">
                {" "}
                {/* Time */}
                <div className="flex justify-between space-x-2 min-w-[191px]">
                  <div className="flex flex-col">
                    <h1 className="font-medium text-sm">Start Time</h1>
                    <Select
                      isSearchable="false"
                      placeholder=""
                      className={"react-select-container"}
                      classNamePrefix={"react-time"}
                      options={courseAttributes["times"]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-medium text-sm">End Time</h1>
                    <Select
                      isSearchable="false"
                      placeholder=""
                      className={"react-select-container"}
                      classNamePrefix={"react-time"}
                      options={courseAttributes["times"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex flex-col mt-4 max-h-72 border border-gray-300 rounded-md overflow-y-scroll">
          <div className="font-semibold text-base">
            {!loading && classes.length > 0 && (
              <ul className="mt-2">
                {classes.map((course) => (
                  <li key={course.id} className="p-2 border-b border-gray-100">
                    <div className="font-medium">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center ">
                          {course.title}
                          <p className="font-normal flex items-center">
                            &nbsp;|&nbsp;
                            <div className="hover:text-blue-400">
                              <CopyPopover crn={course.crn} />
                            </div>
                          </p>
                        </p>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 hover:stroke-neutral-600 transition-all ease-in-out stroke-neutral-400 group-hover:stroke-neutral-500 group-focus-within:stroke-neutral-500 hover:cursor-pointer"
                          alt="plus icon"
                          onClick={() => addToCart(course)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm font-normal flex flex-row items-center w-96 justify-between">
                        <div className="flex items-center">
                          {course.seats_available} / {course.seats_max}
                          <p>&nbsp;Seats Remaining</p>
                        </div>
                      </div>
                      <div className="flex items-center font-normal text-sm space-x-2 ">
                        {/* Days of the week */}
                        {/* Only display the first schedule */}

                        {course.schedules.length > 0 && (
                          <div className="flex items-center space-x-2">
                            {daysOfWeek.map((day) => {
                              const firstSchedule = course.schedules[0]; // Get only the first schedule
                              const isActive =
                                firstSchedule.days?.[day.key] === true;

                              return (
                                <span
                                  key={day.key}
                                  className={
                                    isActive
                                      ? "font-bold text-neutral-600" // Active day styling
                                      : "text-gray-400 font-medium" // Inactive day styling
                                  }
                                >
                                  {day.label}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <p className="text-sm">|</p>
                        <p>
                          {course.schedules[0].start_time}-
                          {course.schedules[0].end_time}
                        </p>
                      </div>
                      <div className="flex items-center font-normal text-sm space-x-2">
                        {/* second schedule */}
                        {course.schedules.length > 1 ? (
                          <div className="flex items-center space-x-2">
                            {daysOfWeek.map((day) => {
                              const secondSchedule = course.schedules[1]; // Get the second schedule
                              const isActive =
                                secondSchedule.days?.[day.key] === true;
                              return (
                                <span
                                  key={day.key}
                                  className={
                                    isActive
                                      ? "font-bold text-neutral-600" // Active day styling
                                      : "text-gray-400 font-medium" // Inactive day styling
                                  }
                                >
                                  {day.label}
                                </span>
                              );
                            })}
                            <div className="flex items-center space-x-2">
                              <p>|</p>
                              <div>
                                {course.schedules[1]?.start_time}-
                                {course.schedules[1]?.end_time}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>No Lab Section</div>
                        )}
                      </div>

                      {console.log(course)}
                    </div>
                    <div className="flex flex-col">
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
  );
}
