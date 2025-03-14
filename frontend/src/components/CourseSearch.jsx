import { useState, useEffect } from "react";
import { fetchCourseList } from "../apis/courseFetcher";
import { CourseList } from "./CourseList";
import { CourseFilters } from "./CourseFilters";

export function CourseSearch() {
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
  }, [
    searchInput,
    selectedGUR,
    selectedSubject,
    selectedDelivery,
    selectedInstructor,
    selectedDays,
    selectedStartTime,
    selectedEndTime,
  ]);

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
  }, [
    page,
    searchInput,
    selectedGUR,
    selectedSubject,
    selectedDelivery,
    selectedInstructor,
    selectedDays,
    selectedStartTime,
    selectedEndTime,
  ]);

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
    <div className="flex flex-col items-center justify-between gap-4 w-full h-full sm:h-[calc(88vh-129px)]">
      <div className="flex flex-col w-full sm:max-h-full">
        {/* Search and Filter Form */}
        <CourseFilters
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          selectedGUR={selectedGUR}
          setSelectedGUR={setSelectedGUR}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedDelivery={selectedDelivery}
          setSelectedDelivery={setSelectedDelivery}
          selectedInstructor={selectedInstructor}
          setSelectedInstructor={setSelectedInstructor}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          selectedStartTime={selectedStartTime}
          setSelectedStartTime={setSelectedStartTime}
          selectedEndTime={selectedEndTime}
          setSelectedEndTime={setSelectedEndTime}
          handleSearch={handleSearch}
        />

        {/* Scrollable Course List */}
        <div className="flex flex-col mt-4 border border-gray-300 rounded-md overflow-y-scroll">
          <div className="font-semibold text-base">
            {loading ? (
              <div className="flex justify-center items-center h-full py-4">
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
              <ul className="">
                <div className="flex flex-col rounded-md overflow-y-scroll">
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
                    ) : (
                      <CourseList courses={classes} variant="coursesearch" />
                    )}
                  </div>
                </div>
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
