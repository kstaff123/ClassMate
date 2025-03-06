export function convert24hourTo12hour(time24) {
    if (!time24 || time24 === "TBA") return "TBA";
  
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
  