export function convert24hourTo12hour(time24) {
  if (!time24 || typeof time24 !== "string" || !time24.includes(":")) {
    return "TBA"; // Return "TBA" when time is missing or invalid
  }

  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "pm" : "am";

  // Convert hour into 12-hour format
  if (isNaN(hour)) return "TBA"; // Handle NaN cases

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  return `${hour}:${minute}${ampm}`;
}
