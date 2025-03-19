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

// Helper function to parse days string into JSON
const parseDaysString = (daysString) => {
  const dayMap = {
    M: "monday",
    T: "tuesday",
    W: "wednesday",
    R: "thursday",
    F: "friday",
    S: "saturday",
    U: "sunday", // Using 'U' for Sunday to avoid conflict with Saturday
  };

  const days = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  if (!daysString) return days;

  for (const char of daysString) {
    const dayKey = dayMap[char];
    if (dayKey) {
      days[dayKey] = true;
    }
  }

  return days;
};

// Rest of the Schedule component remains the same...
export function Schedule() {
  const { cart, courseColors } = useCart();
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
  const [paddingHours] = useState(0);
  const resizeData = useRef({ startY: 0, startHeight: rowHeight });

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
      if (!sched.days || sched.start_time === "TBA" || sched.end_time === "TBA")
        return;

      // Parse the days string into JSON
      const daysJson = parseDaysString(sched.days);

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
        if (!dayKey || !daysJson[dayKey]) return;
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
            startFloat,
            endFloat,
          });
        }
      });
    });
  });

  // Rest of the Schedule component remains the same...
  return (
    <div className="flex w-full text-sm">
      {/* Render the schedule grid */}
    </div>
  );
}