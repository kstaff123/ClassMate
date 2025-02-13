import "../App.css";
import { useState } from "react";

export function Schedule() {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   // Generate time labels from 7 AM to 11 PM
    const times = Array.from({ length: 17 }, (_, i) => {
    let hour = 7 + i;
    let period = hour >= 12 ? "pm" : "am"; // Determine AM or PM
    if (hour > 12) hour -= 12; // Convert to 12-hour format
    return `${hour}${period}`;
});
    return (
        <div className="max-w-4xl mx-auto overflow-hidden">
            {/* Calendar Grid */}
      <div className="grid grid-cols-8 border border-gray-300 mt-4">
        {/* Days Row */}
        <div className="bg-gray-100 w-25 min-w-[5rem]"></div>
        {days.map((day, index) => (
          <div key={index} className="border border-gray-300 p-2 text-center font-medium bg-gray-100">
            {day}
          </div>
        ))}

        {/* Time Slots */}
        {times.map((time, i) => (
          <>
            <div key={`time-${i}`} className="border border-gray-300 p-2 text-center font-medium bg-gray-100">
              {time}
            </div>
            {days.map((_, j) => (
              <div key={`slot-${i}-${j}`} className="border border-gray-300 h-25"></div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}