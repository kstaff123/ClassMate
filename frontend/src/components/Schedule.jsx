import "../App.css";
import React, { useState, useRef } from "react";
import { useCart } from "./CartContext";

// If your schedule uses day booleans like "monday: true":
const dayNameMap = {
  Sun: "sunday",
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
};

function parseTimeToFloat(timeStr) {
  // e.g. "3:00pm" => 8.0, "4:50pm" => 9.83
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (!match) return 0;
  let [, hourStr, minuteStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  ampm = ampm.toLowerCase();
  if (ampm === "pm" && hour < 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;
  const floatVal = hour + minutes / 60 - 7; // 7am => 0
  return Math.min(Math.max(floatVal, 0), 16); // clamp to [0..16]
}

export function Schedule() {
  const { cart } = useCart();

  // 7 columns for days, 17 rows for times (7am–11pm)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = Array.from({ length: 17 }, (_, i) => {
    let hour = 7 + i;
    const period = hour >= 12 ? "pm" : "am";
    if (hour > 12) hour -= 12;
    return `${hour}${period}`;
  });

  // For row resizing
  const [rowHeight, setRowHeight] = useState(64);
  const resizeData = useRef({ startY: 0, startHeight: rowHeight });
  const handleMouseDown = (e) => {
    document.body.style.userSelect = "none";
    resizeData.current.startY = e.clientY;
    resizeData.current.startHeight = rowHeight;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    const dy = (e.clientY - resizeData.current.startY) * 0.1;
    const newHeight = Math.max(30, resizeData.current.startHeight + dy);
    setRowHeight(newHeight);
  };
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "";
  };

  /**
   * We store blocks in occupiedCells["dayIndex-hourIndex"].
   * Each block now stores:
   *  - course,
   *  - isFirstHour (true if this cell is the first cell for the course block),
   *  - isLastHour (true if this cell is the last cell for the course block),
   *  - coverageStart, coverageEnd,
   *  - startCell, endCell.
   */
  const occupiedCells = {};
  cart.forEach((course) => {
    if (!course.schedules) return;
    course.schedules.forEach((sched) => {
      if (!sched.days) return;
      const startFloat = parseTimeToFloat(sched.start_time || "7:00am");
      const endFloat = parseTimeToFloat(sched.end_time || "11:00pm");
      days.forEach((label, dayIndex) => {
        const dayKey = dayNameMap[label];
        if (!dayKey || !sched.days[dayKey]) return;
        const startCell = Math.floor(startFloat);
        const endCell = Math.floor(endFloat);
        for (let cell = startCell; cell <= endCell; cell++) {
          let coverageStart = 0;
          if (cell === startCell) {
            coverageStart = startFloat - startCell;
          }
          let coverageEnd = 1;
          if (cell === endCell) {
            coverageEnd = endFloat - endCell;
          }
          if (coverageEnd <= coverageStart) continue;
          const cellKey = `${dayIndex}-${cell}`;
          if (!occupiedCells[cellKey]) {
            occupiedCells[cellKey] = [];
          }
          // Use booleans: if the cell equals the startCell, mark it as the first; if equals the endCell, mark it as the last.
          const isFirstHour = cell === startCell;
          const isLastHour = cell === endCell;
          occupiedCells[cellKey].push({
            course,
            isFirstHour,
            isLastHour,
            coverageStart,
            coverageEnd,
            startCell,
            endCell,
          });
        }
      });
    });
  });

  return (
    <div className="flex w-full text-sm">
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}
      >
        {/* Header Row */}
        <div
          className="bg-gray-100 relative drop-shadow-md"
          style={{
            height: 30,
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#f3f4f6",
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
            onMouseDown={handleMouseDown}
          />
        </div>
        {days.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-medium bg-gray-100 flex items-center justify-center drop-shadow-md"
            style={{
              height: 30,
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#f3f4f6",
              borderLeft: "1px solid #ccc",
            }}
          >
            {day}
          </div>
        ))}

        {/* Time Rows */}
        {times.map((timeLabel, hourIndex) => (
          <React.Fragment key={hourIndex}>
            {/* Left column: time label */}
            <div
              className="p-2 text-center font-medium bg-gray-100 flex items-center justify-center relative cursor-ns-resize"
              onMouseDown={handleMouseDown}
              style={{
                height: rowHeight,
                borderTop: "1px solid #ccc",
              }}
            >
              {timeLabel}
              <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
                onMouseDown={handleMouseDown}
              />
            </div>
            {/* 7 day columns for this hour */}
            {days.map((day, dayIndex) => {
              const cellKey = `${dayIndex}-${hourIndex}`;
              const blocks = occupiedCells[cellKey] || [];
              // Default cell style: top & left borders
              const cellStyle = {
                position: "relative",
                height: rowHeight,
                overflow: "hidden",
                borderTop: "1px solid #ccc",
                borderLeft: "1px solid #ccc",
              };
              // If any block continues from above, remove the top border for a smooth transition.
              const continuingBlock = blocks.some((b) => b.coverageStart === 0 && b.startCell < hourIndex);
              if (continuingBlock) {
                cellStyle.borderTop = "none";
              }
              return (
                <div key={cellKey} style={cellStyle}>
                  {blocks.map((block, idx) => {
                    const color =
                      blocks.length > 1
                        ? "rgba(255, 0, 0, 0.6)"
                        : "oklch(0.707 0.165 254.624)";
                    const blockTop = block.coverageStart * 100; // in %
                    const blockHeight = (block.coverageEnd - block.coverageStart) * 100; // in %
                    // Use our stored booleans to decide if this cell is the first or last.
                    const radiusStyle = {};
                    if (block.isFirstHour) {
                      radiusStyle.borderTopLeftRadius = "8px";
                      radiusStyle.borderTopRightRadius = "8px";
                    }
                    if (block.isLastHour) {
                      radiusStyle.borderBottomLeftRadius = "8px";
                      radiusStyle.borderBottomRightRadius = "8px";
                    }
                    return (
                      <div
                        key={idx}
                        style={{
                          textAlign: "center",
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: blockTop + "%",
                          padding: "4px",
                          boxSizing: "border-box",
                          height: blockHeight + "%",
                          backgroundColor: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          font: "Montserrat",
                          fontWeight: "500",
                          color: "white",
                          fontSize: "0.8rem",
                          ...radiusStyle,
                        }}
                      >
                        {block.isFirstHour && (
                          <div>
                            {block.course.subject} {block.course.class_number}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
