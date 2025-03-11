import React, { useState, useEffect, useRef } from "react";

export default function CustomSelect({
  label,
  options = [],
  placeholder = "Select an option",
  value,             // if you want a controlled component, pass the current value in
  onChange,          // callback to receive the selected option
  className = "",    // extra Tailwind classes for sizing/spacing
}) {
  const [isOpen, setIsOpen] = useState(false);
  // If not using controlled props, store selection in local state:
  const [selectedOption, setSelectedOption] = useState(value || null);

  const selectRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option); // Pass selection back up if needed
    }
    setIsOpen(false);
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keep local state synced with external "value" if you're using controlled props
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  return (
    <div className={`flex flex-col relative ${className}`} ref={selectRef}>
      {label && <label className="text-sm font-medium mb-1">{label}</label>}

      {/* "Button" that toggles the dropdown */}
      <div
        onClick={toggleDropdown}
        className="bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between cursor-pointer max-h-[40px] min-h-[40px]"
      >
        <span className={selectedOption ? "text-gray-800 font-medium text-sm" : "text-gray-400 font-medium text-sm"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-gray-400 ${
            isOpen ? "" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute mt-1 top-14 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
