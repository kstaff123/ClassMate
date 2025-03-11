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
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(value || null);

  const selectRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option); // Pass selection back up if needed
    }
    // Set the search term to the selected label so it displays when not focused
    setSearchTerm(option.label);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync local state with external "value" for controlled components
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
      setSearchTerm(value ? value.label : "");
    }
  }, [value]);

  return (
    <div className={`flex flex-col relative ${className}`} ref={selectRef}>
      {label && <label className="text-sm font-medium mb-1">{label}</label>}

      <div className="bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between cursor-pointer max-h-[40px] min-h-[40px]">
        <input
          type="text"
          value={
            isFocused
              ? searchTerm
              : selectedOption
              ? selectedOption.label
              : ""
          }
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-black font-medium text-sm"
          onFocus={() => {
            setIsFocused(true);
            // If there's a selected option, clear it when the user focuses for a new search
            if (selectedOption) {
              setSelectedOption(null);
              setSearchTerm("");
              if (onChange) onChange(null);
            }
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        {/* Dropdown Arrow */}
        <svg
          className="w-4 h-4 text-gray-800"
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
        <div className="absolute mt-1 top-[59.2px] w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul className="max-h-60 overflow-y-scroll">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
