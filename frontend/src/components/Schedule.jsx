import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartContext";

// Map for day names
const dayNameMap = {
  Sun: "sunday",
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
};

function convert24hourTo12hour(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }
  return `${hour}:${minute}${ampm}`;
}

function parseTimeToFloat(timeStr) {
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
  const scheduleRef = useRef(null);

  // Setup days and times
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = Array.from({ length: 17 }, (_, i) => {
    let hour = 7 + i;
    const period = hour >= 12 ? "pm" : "am";
    if (hour > 12) hour -= 12;
    return `${hour}${period}`;
  });

  // Determine mobile: larger default/minimum row height
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const defaultRowHeight = isMobile ? 64 : 80;
  const minRowHeight = isMobile ? 60 : 50;

  const [rowHeight, setRowHeight] = useState(defaultRowHeight);
  const [paddingHours, setPaddingHours] = useState(0);
  const resizeData = useRef({ startY: 0, startHeight: rowHeight });

  // ----- Pointer event handlers -----
  const handlePointerDown = (e) => {
    e.preventDefault();
    document.body.style.userSelect = "none";
    resizeData.current.startY = e.clientY;
    resizeData.current.startHeight = rowHeight;
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const dy = (e.clientY - resizeData.current.startY) * 0.1;
    const newHeight = Math.max(minRowHeight, resizeData.current.startHeight + dy);
    setRowHeight(newHeight);
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.body.style.userSelect = "";
  };

  // ----- Touch event handlers -----
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default scrolling behavior
    document.body.style.userSelect = "none";
    const touchY = e.touches[0].clientY;
    resizeData.current.startY = touchY;
    resizeData.current.startHeight = rowHeight;
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const dy = (touchY - resizeData.current.startY) * 0.1;
    const newHeight = Math.max(minRowHeight, resizeData.current.startHeight + dy);
    setRowHeight(newHeight);
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.body.style.userSelect = "";
  };

  // Build map of occupied cells
  const occupiedCells = {};
  let totalStart = 0;
  let totalEnd = 0;
  let classCount = 0;
  let minStart = 16;
  let maxEnd = 0;

  cart.forEach((course) => {
    if (!course.schedules) return;
    course.schedules.forEach((sched) => {
      if (!sched.days || sched.start_time === "TBA" || sched.end_time === "TBA") return;
      const hour12starttime = convert24hourTo12hour(sched.start_time);
      const hour12endtime = convert24hourTo12hour(sched.end_time);
      const startFloat = parseTimeToFloat(hour12starttime || "7:00am");
      const endFloat = parseTimeToFloat(hour12endtime || "11:00pm");

      totalStart += startFloat;
      totalEnd += endFloat;
      classCount++;
      minStart = Math.min(minStart, startFloat);
      maxEnd = Math.max(maxEnd, endFloat);

      days.forEach((label, dayIndex) => {
        const dayKey = dayNameMap[label];
        if (!dayKey || !sched.days[dayKey]) return;
        const startCell = Math.floor(startFloat);
        const endCell = Math.floor(endFloat);
        for (let cell = startCell; cell <= endCell; cell++) {
          let coverageStart = cell === startCell ? startFloat - startCell : 0;
          let coverageEnd = cell === endCell ? endFloat - endCell : 1;
          if (coverageEnd <= coverageStart) continue;
          const cellKey = `${dayIndex}-${cell}`;
          if (!occupiedCells[cellKey]) {
            occupiedCells[cellKey] = [];
          }
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

  // Auto-adjust row height based on schedule span
  useEffect(() => {
    const totalHours = maxEnd - minStart;
    const calculated = Math.max(minRowHeight, Math.min(32, 1024 / (totalHours || 1)));
    setRowHeight(calculated);
  }, [minStart, maxEnd, paddingHours, minRowHeight]);

  // Scroll to the middle of user’s classes
  useEffect(() => {
    if (classCount > 0) {
      const avgStart = totalStart / classCount;
      const avgEnd = totalEnd / classCount;
      const middleTimeIndex = Math.floor((avgStart + avgEnd) / 2) - 1;
      const middleTimeElement = scheduleRef.current?.querySelector(
        `div[data-time-index="${middleTimeIndex-1}"]`
      );
      if (middleTimeElement) {
        middleTimeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [cart, totalStart, totalEnd, classCount]);

  return (
    <div className="flex w-full text-sm">
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}
        ref={scheduleRef}
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
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute bottom-0 left-0 right-0 h-4" />
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
            onPointerDown={handlePointerDown}
            onTouchStart={handleTouchStart}
          >
            {day}
          </div>
        ))}

        {/* Time Rows */}
        {times.map((timeLabel, hourIndex) => (
          <React.Fragment key={hourIndex}>
            <div
              className="p-2 text-center font-medium bg-gray-100 flex items-center justify-center relative"
              style={{ height: rowHeight, borderTop: "1px solid #ccc" }}
              data-time-index={hourIndex}
              onPointerDown={handlePointerDown}
              onTouchStart={handleTouchStart}
            >
              {timeLabel}
            </div>
            {days.map((day, dayIndex) => {
              const cellKey = `${dayIndex}-${hourIndex}`;
              const blocks = occupiedCells[cellKey] || [];
              const cellStyle = {
                position: "relative",
                height: rowHeight,
                overflow: "hidden",
                borderTop: "1px solid #ccc",
                borderLeft: "1px solid #ccc",
              };

              if (blocks.some((b) => b.coverageStart === 0 && b.startCell < hourIndex)) {
                cellStyle.borderTop = "none";
              }

              return (
                <div
                  key={cellKey}
                  style={cellStyle}
                  onPointerDown={handlePointerDown}
                  onTouchStart={handleTouchStart}
                >
                  {blocks.map((block, idx) => {
                    const color =
                      blocks.length > 1
                        ? "rgba(0, 0, 0, 0.1)"
                        : "oklch(0.707 0.165 254.624)";
                    const blockTop = block.coverageStart * 100;
                    const blockHeight = (block.coverageEnd - block.coverageStart) * 100;
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
                          fontFamily: "Montserrat, sans-serif",
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
