import "../App.css";
import { useState } from "react";

export function Schedule() {
    return(
       <div className="grid grid-cols-8 border border-gray-300 mt-4">
        {/*days row*/}
        {days.map((day, index) => (
          <div key={index} className="border border-gray-300 p-2 text-center font-medium bg-gray-100">
            {day}
          </div>
        ))}

        {/*time slots*/}
        {times.map((time, i) => (
          <>
            <div key={`time-${i}`} className="border border-gray-300 p-2 text-right font-medium bg-gray-100">
              {time}
            </div>
            {days.map((_, j) => (
              <div key={`slot-${i}-${j}`} className="border border-gray-300 h-16 hover:bg-gray-200"></div>
            ))}
          </>
        ))}
       </div>
    )
}