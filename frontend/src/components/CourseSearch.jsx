import { useState, useEffect } from "react";
import Select from "react-select";
import courseAttributes from "../json/courseAttributes.json";
import instructorList from "../json/instructors.json";
import { fetchCourseList } from "../apis/courseFetcher";
import CopyPopover from "./CopyPopover";
import { useCart } from "./CartContext";

function convert24hourTo12hour(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  
  // Convert hour into 12-hour format
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }
  
  return `${hour}:${minute}${ampm}`;
}

export function CourseSearch() {
  const { addToCart } = useCart();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state with lazy initialization
  const [page, setPage] = useState(() => {
    const savedState = localStorage.getItem("courseSearchState");
    return savedState ? JSON.parse(savedState).page : 1;
  });
  const [pageInput, setPageInput] = useState(page.toString());
  const pageSize = 10; // adjust as needed
  const [totalPages, setTotalPages] = useState(1);

  const [selectedGUR, setSelectedGUR] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  // Reset page to 1 whenever any filter parameter changes
  useEffect(() => {
    setPage(1);
    setPageInput("1");
  }, [searchInput, selectedGUR, selectedSubject, selectedDelivery, selectedInstructor, selectedDays, selectedStartTime, selectedEndTime]);

  // Save search state to localStorage
  useEffect(() => {
    const searchState = {
      classes,
      page,
      selectedGUR,
      selectedSubject,
      selectedDelivery,
      selectedInstructor,
      selectedDays,
      selectedStartTime,
      selectedEndTime,
      searchInput,
    };
    localStorage.setItem("courseSearchState", JSON.stringify(searchState));
  }, [
    classes,
    page,
    selectedGUR,
    selectedSubject,
    selectedDelivery,
    selectedInstructor,
    selectedDays,
    selectedStartTime,
    selectedEndTime,
    searchInput,
  ]);

  const daysOfWeek = [
    { key: "sunday", label: "S" },
    { key: "monday", label: "M" },
    { key: "tuesday", label: "T" },
    { key: "wednesday", label: "W" },
    { key: "thursday", label: "T" },
    { key: "friday", label: "F" },
    { key: "saturday", label: "S" },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Build filters object
      const filters = {
        searchInput: searchInput || undefined,
        selectedSubject: selectedSubject?.value,
        selectedGUR: selectedGUR?.value,
        selectedDelivery: selectedDelivery?.value,
        selectedInstructor: selectedInstructor?.value,
        selectedDays: selectedDays,
        selectedStartTime: selectedStartTime?.value,
        selectedEndTime: selectedEndTime?.value,
      };

      // Fetch data with pagination and filters
      const data = await fetchCourseList(page, pageSize, filters);
      let filteredClasses = data?.data || [];

      // Update totalPages based on API metadata (adjust property names per your API)
      if (data?.meta?.pagination?.pageCount) {
        setTotalPages(data.meta.pagination.pageCount);
      } else {
        setTotalPages(1);
      }

      console.log(
        "Raw API Response:",
        JSON.stringify(filteredClasses, null, 2)
      );
      setClasses(filteredClasses);
    } catch (error) {
      console.error("Error during filtering:", error);
      setClasses([]);
    }
    setLoading(false);
  };

  // Trigger search on initial mount and whenever page or filters change.
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchInput, selectedGUR, selectedSubject, selectedDelivery, selectedInstructor, selectedDays, selectedStartTime, selectedEndTime]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      setPageInput((prev) => (parseInt(prev, 10) + 1).toString());
      window.scrollTo(0, 0); // Scroll to top
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
    setPageInput((prev) => Math.max(parseInt(prev, 10) - 1, 1).toString());
    window.scrollTo(0, 0); // Scroll to top
  };

  // Handler for page input changes using a separate state variable
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  // When the input loses focus or Enter is pressed, validate and update page state.
  const handlePageInputBlur = () => {
    const newPage = parseInt(pageInput, 10);
    if (!isNaN(newPage)) {
      if (newPage < 1) {
        setPage(1);
        setPageInput("1");
      } else if (newPage > totalPages) {
        setPage(totalPages);
        setPageInput(totalPages.toString());
      } else {
        setPage(newPage);
      }
      window.scrollTo(0, 0); // Scroll to top
    } else {
      // Reset to current page if invalid input
      setPageInput(page.toString());
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePageInputBlur();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-nowrap w-full">
      <div className="flex flex-col w-full">
        {/* Search and Filter Form */}
        <div className="flex items-start justify-between gap-4 flex-nowrap min-w-fit">
          <div className="flex flex-col w-96">
            <h1 className="text-sm font-medium">
              <span>&#8203;</span>
            </h1>
            <div className="bg-gray-200 text-stone-700 group border-none outline-none w-full h-10 rounded-lg flex items-center">
              <input
                placeholder="Class Title or CRN"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                className="w-full max-w-full flex h-full rounded-3xl group placeholder:text-stone-400 group-hover:placeholder:text-stone-500 group-focus-within:placeholder:text-stone-500 bg-transparent border-none outline-none text-lg font-normal px-4 placeholder:transition-all ease-in-out"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mx-2 stroke-neutral-400 group-hover:stroke-neutral-500 group-focus-within:stroke-neutral-500 hover:stroke-neutral-600 transition-all ease-in-out hover:cursor-pointer stroke-2 flex-shrink-0"
                onClick={handleSearch}
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
              {/* GUR Attribute */}
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">GUR Attribute</h1>
                <Select
                  isSearchable={false}
                  placeholder=""
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={courseAttributes["gurAttributes"]}
                  onChange={setSelectedGUR}
                />
              </div>
              {/* Subject */}
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Subject</h1>
                <Select
                  isSearchable={false}
                  placeholder=""
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={courseAttributes["subjects"]}
                  onChange={setSelectedSubject}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Instructor */}
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Instructor</h1>
                <Select
                  isSearchable={false}
                  placeholder=""
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={instructorList["instructors"]}
                  onChange={setSelectedInstructor}
                />
              </div>
              {/* Delivery Method */}
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Delivery Method</h1>
                <Select
                  isSearchable={false}
                  placeholder=""
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={courseAttributes["deliveryMethods"]}
                  onChange={setSelectedDelivery}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col w-[191px]">
                <h1 className="font-medium text-sm">Days</h1>
                <div className="flex space-x-4 border border-gray-300 rounded-sm p-1 justify-around">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day.key}
                      className="flex flex-col text-xs items-center font-medium"
                    >
                      {day.label}
                      <input
                        className="size-3"
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDays((prev) => [...prev, day]);
                          } else {
                            setSelectedDays((prev) =>
                              prev.filter((d) => d.key !== day.key)
                            );
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex-col">
                <div className="flex justify-between space-x-2 min-w-[191px]">
                  <div className="flex flex-col">
                    <h1 className="font-medium text-sm">Start Time</h1>
                    <Select
                      isSearchable={false}
                      placeholder=""
                      className="react-select-container"
                      classNamePrefix="react-time"
                      options={courseAttributes["times"]}
                      onChange={setSelectedStartTime}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-medium text-sm">End Time</h1>
                    <Select
                      isSearchable={false}
                      placeholder=""
                      className="react-select-container"
                      classNamePrefix="react-time"
                      options={courseAttributes["times"]}
                      onChange={setSelectedEndTime}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex flex-col mt-4 min-h-72 max-h-72 border border-gray-300 rounded-md overflow-y-scroll">
          <div className="font-semibold text-base">
            {loading ? (
              <div className="flex justify-center items-center min-h-72 h-full py-4">
                <svg
                  className="animate-spin h-8 w-8 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            ) : classes.length > 0 ? (
              <ul className="mt-2">
                {classes.map((course) => (
                  <li key={course.id} className="p-2 border-b border-gray-100">
                    {/* Render course details */}
                    <div className="font-medium">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center ">
                          {course.title}
                          <p className="font-normal flex items-center">
                            &nbsp;|&nbsp;
                            <div className="font-normal ">
                              {course.subject}&nbsp;{course.class_number}
                            </div>
                            <div className="font-normal flex items-center ">
                              &nbsp;|&nbsp;
                            </div>
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
                      <div className="text-sm font-normal flex flex-row items-center w-fit justify-between">
                        <div className="flex items-center">
                          <div className="font-medium">
                            {course.seats_available} / {course.seats_max}
                          </div>
                          <p>&nbsp;Seats Remaining</p>
                          <div className="font-medium">
                            &nbsp;|&nbsp;
                            {(() => {
                              const instructorName = course.instructors?.[0]?.name;
                              if (instructorName) {
                                const [lastName, firstName] = instructorName.split(", ");
                                return `${firstName} ${lastName}`;
                              }
                              return "Instructor TBA";
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center font-normal text-sm space-x-2 ">
                        {course.schedules && course.schedules.length > 0 ? (
                          <div className="flex items-center space-x-2">
                            {daysOfWeek.map((day) => {
                              const firstSchedule = course.schedules[0];
                              const isActive =
                                firstSchedule.days?.[day.key] === true;
                              return (
                                <span
                                  key={day.key}
                                  className={
                                    isActive
                                      ? "font-bold text-neutral-600"
                                      : "text-gray-400 font-medium"
                                  }
                                >
                                  {day.label}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
                        <p className="text-sm">|</p>
                        <p>
                          {course.schedules && course.schedules.length > 0
                            ? course.schedules[0]?.start_time === "TBA" ||
                              course.schedules[0]?.end_time === "TBA"
                              ? "TBA"
                              : `${convert24hourTo12hour(
                                  course.schedules[0]?.start_time
                                )} - ${convert24hourTo12hour(
                                  course.schedules[0]?.end_time
                                )}`
                            : "No schedule data"}
                        </p>
                      </div>
                      <div className="flex items-center font-normal text-sm space-x-2">
                        {course.schedules && course.schedules.length > 1 ? (
                          <div className="flex items-center space-x-2">
                            {daysOfWeek.map((day) => {
                              const secondSchedule = course.schedules[1];
                              const isActive =
                                secondSchedule.days?.[day.key] === true;
                              return (
                                <span
                                  key={day.key}
                                  className={
                                    isActive
                                      ? "font-bold text-neutral-600"
                                      : "text-gray-400 font-medium"
                                  }
                                >
                                  {day.label}
                                </span>
                              );
                            })}
                            <div className="flex items-center space-x-2">
                              <p>|</p>
                              <div>
                              {course.schedules && course.schedules.length > 1
                            ? course.schedules[1]?.start_time === "TBA" ||
                              course.schedules[1]?.end_time === "TBA"
                              ? "TBA"
                              : `${convert24hourTo12hour(
                                  course.schedules[1]?.start_time
                                )} - ${convert24hourTo12hour(
                                  course.schedules[1]?.end_time
                                )}`
                            : "No schedule data"}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>No Lab Section</div>
                        )}
                      </div>
                      {console.log(course)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">No courses found</div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 text-base font-normal flex-nowrap">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-2 py-2 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50 transition-all ease-in-out flex-nowrap"
          >
            Prev Page
          </button>
          <div className="px-2 py-2 flex bg-gray-200 justify-center flex-nowrap">
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              className="flex text-center bg-transparent outline-none  flex-nowrap"
              inputMode="numeric"
              maxLength="3"
              max={totalPages}
              size={3}
            />
            <div>/</div>
            <div className="flex flex-nowrap min-w-[33px] text-center justify-center">
              {totalPages}
            </div>
          </div>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="px-2 py-2 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50 transition-all ease-in-out"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}

// Define the page input handlers inside the component to access state setters
function handlePageInputChange(e) {
  // This will be redefined in the component's scope, so ignore this here.
}

function handlePageInputBlur() {
  // This will be redefined in the component's scope, so ignore this here.
}

function handlePageInputKeyDown(e) {
  // This will be redefined in the component's scope, so ignore this here.
}
