import "../App.css";
import React, { useState, useRef } from "react";

export function Schedule() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [rowHeight, setRowHeight] = useState(64); // default row height (64px ~ h-16)
  // useRef to store initial drag values
  const resizeData = useRef({ startY: 0, startHeight: rowHeight });

  const handleMouseDown = (e) => {
    const scrollContainer = document.getElementById("scrollable-container");
    if (scrollContainer) {
      scrollContainer.style.overflow = "hidden";
    }
    document.body.style.userSelect = "none";
    // Save the initial Y position and the current row height
    resizeData.current.startY = e.clientY;
    resizeData.current.startHeight = rowHeight;
    // Add event listeners on document for mousemove/up
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    // Calculate the vertical movement
    const sensitivity = 0.1;
    const dy = (e.clientY - resizeData.current.startY) * sensitivity;
    // Update rowHeight, with a minimum value (e.g., 30px)
    const newHeight = Math.max(30, resizeData.current.startHeight + dy);
    setRowHeight(newHeight);
  };

  const handleMouseUp = () => {
    // Clean up event listeners when the mouse is released
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    const scrollContainer = document.getElementById("scrollable-container");
    if (scrollContainer) {
      scrollContainer.style.overflow = "";
    }
  };
  document.body.style.userSelect = "";

  // Generate time labels from 7 AM to 11 PM
  const times = Array.from({ length: 17 }, (_, i) => {
    let hour = 7 + i;
    let period = hour >= 12 ? "pm" : "am";
    if (hour > 12) hour -= 12;
    return `${hour}${period}`;
  });

  return (
    <div className="flex w-full text-sm">
      <div
        className="grid border-gray-300 w-full"
        style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }} // first column fixed, rest flexible
      >
        {/* Header Row */}
        <div
          className="border border-gray-300 bg-gray-100 relative drop-shadow-md"
          style={{
            height: 30,
            position: "sticky",
            top: 0,
            zIndex: 10, // ensures it stays on top when scrolling
            background: "#f3f4f6" // same as bg-gray-100 in Tailwind
          }}
        >
          {/* Optionally add a drag handle here if needed */}
          <div className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize" />
        </div>
        {days.map((day, index) => (
          <div
            key={index}
            className="border border-gray-300 p-2 text-center font-medium bg-gray-100 flex items-center justify-center drop-shadow-md"
            style={{
              height: 30,
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#f3f4f6"
            }}
          >
            {day}
          </div>
        ))}

        {/* Time Slots and Day Cells */}
        {times.map((time, i) => (
          <React.Fragment key={i}>
            {/* Time Cell with drag handle */}
            <div
              className="border border-gray-300 p-2 text-center font-medium bg-gray-100 flex items-center justify-center relative cursor-ns-resize min-h-12"
              onMouseDown={handleMouseDown}
              style={{ height: rowHeight }}
            >
              {time}
              <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
                onMouseDown={handleMouseDown}
              />
            </div>
            {days.map((_, j) => (
              <div
                key={`slot-${i}-${j}`}
                className="border border-gray-300 min-h-12"
                style={{ height: rowHeight }}
              ></div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
