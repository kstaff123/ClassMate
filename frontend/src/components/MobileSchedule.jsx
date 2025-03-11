import "../App.css";
import React, { useRef } from "react";
import { useCart } from "./CartContext";

// Map for day names (the schedule uses lowercase keys)
const dayNameMap = {
  Sun: "sunday",
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
};

// Converts "13:00" => "1:00pm"
function convert24hourTo12hour(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute}${ampm}`;
}

// Parses "7:30am" => a float where 7:00am = 0, 7:30am = 0.5, 8:00am = 1, etc.
// (Our reference time is 7am)
function parseTimeToFloat(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (!match) return 0;
  let [, hourStr, minuteStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  ampm = ampm.toLowerCase();
  if (ampm === "pm" && hour < 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;
  // Subtract 7 because 7am = 0.
  const floatVal = hour + minutes / 60 - 7;
  return Math.min(Math.max(floatVal, 0), 16);
}

// Formats a 24‑hour number => "1pm"
function formatHour(hour24) {
  const hour = Math.floor(hour24);
  let displayHour = hour;
  const ampm = hour >= 12 ? "pm" : "am";
  if (hour === 0) displayHour = 12;
  else if (hour > 12) displayHour = hour - 12;
  return `${displayHour}${ampm}`;
}

export function MobileSchedule() {
  const { cart } = useCart();
  const scheduleRef = useRef(null);

  // Days of the week
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fixed time range: always 7am (0) to 11pm (16) → 17 time slots
  const startHourIndex = 0;
  const endHourIndex = 17;
  const rowHeight = 60; // each hour row is 60px tall

  // Build time labels (7am–11pm)
  const times = [];
  for (let i = startHourIndex; i < endHourIndex; i++) {
    const hour24 = i + 7;
    times.push(formatHour(hour24));
  }

  // Build a map of occupied cells.
  // We'll store the info per cell, but we render a block only in its start cell.
  const occupiedCells = {};
  cart.forEach((course) => {
    if (!course.schedules) return;
    course.schedules.forEach((sched) => {
      if (!sched.days || sched.start_time === "TBA" || sched.end_time === "TBA")
        return;
      const startFloat = parseTimeToFloat(convert24hourTo12hour(sched.start_time));
      const endFloat = parseTimeToFloat(convert24hourTo12hour(sched.end_time));
      if (endFloat <= startFloat) return;
      const startCell = Math.floor(startFloat);
      const endCell = Math.floor(endFloat);
      days.forEach((dayLabel, dayIndex) => {
        const dayKey = dayNameMap[dayLabel];
        if (!dayKey || !sched.days[dayKey]) return;
        for (let cell = startCell; cell <= endCell; cell++) {
          if (cell < startHourIndex || cell >= endHourIndex) continue;
          const cellKey = `${dayIndex}-${cell}`;
          if (!occupiedCells[cellKey]) occupiedCells[cellKey] = [];
          occupiedCells[cellKey].push({
            course,
            startFloat,
            endFloat,
            startCell,
            endCell,
          });
        }
      });
    });
  });

  return (
    <div className="flex flex-col w-full h-full text-xs">
      {/* Header: Fixed top row */}
      <div className="flex-none">
        <div
          className="grid w-full"
          style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}
        >
          {/* Top-left blank cell */}
          <div
            className="bg-gray-100 border border-gray-300 drop-shadow-md"
            style={{
              height: 30,
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#f3f4f6",
            }}
          />
          {days.map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium bg-gray-100 border border-gray-300 drop-shadow-md flex items-center justify-center"
              style={{
                height: 30,
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "#f3f4f6",
              }}
            >
              <span className="hidden sm:block">{day}</span>
              <span className="block sm:hidden">{day[0]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Body: Scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Set the grid container as relative so sticky positioning works */}
        <div
          className="relative grid w-full"
          style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}
          ref={scheduleRef}
        >
          {times.map((timeLabel, hourIndex) => {
            const actualCell = hourIndex; // our cells are indexed 0..16
            return (
              <React.Fragment key={hourIndex}>
                {/* Time Label Column */}
                <div
                  className="p-2 text-center font-medium bg-gray-100 border border-gray-300 flex items-center justify-center"
                  style={{
                    height: rowHeight,
                    position: "sticky",
                    left: 0,
                    zIndex: 4,
                    background: "#f3f4f6",
                  }}
                  data-time-index={hourIndex}
                >
                  {timeLabel}
                </div>
                {/* Day Cells */}
                {days.map((day, dayIndex) => {
                  const cellKey = `${dayIndex}-${actualCell}`;
                  const blocks = occupiedCells[cellKey] || [];
                  let borderTop = "1px solid #ccc";
                  const cellStyle = {
                    position: "relative",
                    height: rowHeight,
                    overflow: "visible", // allow blocks to extend into adjacent cells
                    borderLeft: "1px solid #ccc",
                  };
                  if (blocks.some((b) => b.startCell < actualCell)) {
                    borderTop = "none";
                  }
                  cellStyle.borderTop = borderTop;
                  return (
                    <div key={cellKey} style={cellStyle}>
                      {blocks.map((block, idx) => {
                        // Render block only in its start cell
                        if (block.startCell !== actualCell) return null;
                        const totalHours = block.endFloat - block.startFloat;
                        if (totalHours <= 0) return null;
                        // Calculate the fractional offset in the start cell
                        const coverageStart = block.startFloat - block.startCell;
                        const topPercent = coverageStart * 100;
                        const heightPercent = totalHours * 100;
                        const radiusStyle = {
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        };
                        // Round bottom corners if the class ends before 11pm
                        if (block.endCell < endHourIndex) {
                          radiusStyle.borderBottomLeftRadius = "8px";
                          radiusStyle.borderBottomRightRadius = "8px";
                        }
                        return (
                          <div
                            key={idx}
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              top: topPercent + "%",
                              height: heightPercent + "%",
                              backgroundColor: "oklch(0.707 0.165 254.624)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              padding: "4px",
                              boxSizing: "border-box",
                              ...radiusStyle,
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              {block.course.subject} {block.course.class_number}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
