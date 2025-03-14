import React, { useState } from "react";
import Select from "react-select";
import courseAttributes from "../json/courseAttributes.json";
import instructorList from "../json/instructors.json";
import CustomSelect from "./CustomSelect";

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
  const [filtersVisible, setFiltersVisible] = useState(true);

  const daysOfWeek = [
    { key: "sunday", label: "S" },
    { key: "monday", label: "M" },
    { key: "tuesday", label: "T" },
    { key: "wednesday", label: "W" },
    { key: "thursday", label: "T" },
    { key: "friday", label: "F" },
    { key: "saturday", label: "S" },
  ];

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-4 w-full">
      <div className="flex flex-col w-full xl:w-full">
        <h1 className="text-sm font-medium">
          <span>&#8203;</span>
        </h1>
        <div className="bg-gray-200 text-stone-700 group border-none outline-none w-full h-10 rounded-lg flex items-center mt-1">
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
      <div
        className={`flex flex-col w-full  transition-all duration-200 ${
          filtersVisible
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-row items-center space-x-4 md:space-x-4 space-y-4 md:space-y-0">
          {/* GUR Attribute */}
          <div className="flex flex-col w-full xl:w-auto mb-0">
            <CustomSelect
              label="GUR Attribute"
              options={courseAttributes["gurAttributes"]}
              placeholder=""
              value={selectedGUR}
              onChange={(option) => setSelectedGUR(option)}
              className="w-full xl:w-60"
            />
          </div>
          {/* Subject */}
          <div className="flex flex-col w-full xl:w-auto mb-0">
            <CustomSelect
              label="Subject"
              options={courseAttributes["subjects"]}
              placeholder=""
              value={selectedSubject}
              onChange={(option) => setSelectedSubject(option)}
              className="w-full xl:w-60"
            />
          </div>
        </div>
        <div className="flex flex-row items-center space-x-4 md:space-x-4 space-y-4 md:space-y-0">
          {/* Instructor */}
          <div className="flex flex-col w-full xl:w-auto mb-0">
            <CustomSelect
              label="Instructor"
              options={instructorList["instructors"]}
              placeholder=""
              value={selectedInstructor}
              onChange={(option) => setSelectedInstructor(option)}
              className="w-full xl:w-60"
            />
          </div>
          {/* Delivery Method */}
          <div className="flex flex-col w-full xl:w-auto mb-0">
            <CustomSelect
              label="Delivery Method"
              options={courseAttributes["deliveryMethods"]}
              placeholder=""
              value={selectedDelivery}
              onChange={(option) => setSelectedDelivery(option)}
              className="w-full xl:w-60"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-start space-y-4 sm:space-y-0 space-x-4">
          <div className="flex flex-col max-xl:w-full max-xl:max-w-full max-2xl:max-w-[49%] xl:w-[240px]">
            <h1 className="font-medium text-sm mb-1">Days</h1>
            <div className="flex space-x-4 border border-gray-300 rounded-md p-1 py-1 pb-[6px] justify-around">
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
          <div className="flex flex-col w-full xl:w-auto justify-center">
            <div className="flex flex-row items-center w-full justify-between space-x-4 min-w-[191px]">
              <div className="flex flex-col w-full xl:w-[112px]">
                <CustomSelect
                  label="Start Time"
                  options={courseAttributes["times"]}
                  placeholder=""
                  value={selectedStartTime}
                  onChange={(option) => setSelectedStartTime(option)}
                  className="xl:w-[112px] w-full"
                />
              </div>
              <div className="flex flex-col w-full xl:w-[112px]">
                <CustomSelect
                  label="End Time"
                  options={courseAttributes["times"]}
                  placeholder=""
                  value={selectedEndTime}
                  onChange={(option) => setSelectedEndTime(option)}
                  className="xl:w-[112px] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" md:hidden flex justify-center w-full text-sm hover:text-blue-300 mb-2 transition-all ease-in-out font-medium cursor-pointer">
        <div onClick={toggleFilters}>
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </div>
      </div>
    </div>
  );
}
