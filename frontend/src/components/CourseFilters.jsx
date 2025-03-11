import React from "react";
import Select from "react-select";
import courseAttributes from "../json/courseAttributes.json";
import instructorList from "../json/instructors.json";

export function CourseFilters({
  searchInput,
  setSearchInput,
  selectedGUR,
  setSelectedGUR,
  selectedSubject,
  setSelectedSubject,
  selectedDelivery,
  setSelectedDelivery,
  selectedInstructor,
  setSelectedInstructor,
  selectedDays,
  setSelectedDays,
  selectedStartTime,
  setSelectedStartTime,
  selectedEndTime,
  setSelectedEndTime,
  handleSearch,
}) {
  const daysOfWeek = [
    { key: "sunday", label: "S" },
    { key: "monday", label: "M" },
    { key: "tuesday", label: "T" },
    { key: "wednesday", label: "W" },
    { key: "thursday", label: "T" },
    { key: "friday", label: "F" },
    { key: "saturday", label: "S" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-4 w-full">
    <div className="flex flex-col w-full md:w-96">
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
    <div className="flex flex-col w-full md:w-auto">
      <div className="flex flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
        {/* GUR Attribute */}
        <div className="flex flex-col w-full md:w-auto mb-0">
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
        <div className="flex flex-col w-full">
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
      <div className="flex flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0 mt-4">
        {/* Instructor */}
        <div className="flex flex-col w-full md:w-auto mb-0">
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
        <div className="flex flex-col w-full">
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
      <div className="flex flex-col md:flex-row justify-between mt-4 space-y-4 md:space-y-0">
        <div className="flex flex-col w-full md:w-[191px]">
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
        <div className="flex flex-col w-full md:w-auto justify-center">
          <div className="flex flex-row items-center justify-between space-x-0 md:space-x-2 min-w-[191px]">
            <div className="flex flex-col w-full md:w-auto">
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
            <div className="flex flex-col w-full md:w-auto">
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
  );
}