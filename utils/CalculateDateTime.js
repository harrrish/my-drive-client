export function calDateNTime(timeString) {
  const date = new Date(timeString);

  // options for month/day/year
  const options = { year: "numeric", month: "long", day: "numeric" };
  const datePart = date.toLocaleDateString("en-US", options);

  // get hours, minutes, seconds in 24-hour format
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // get timezone offset in hours and minutes
  const offset = -date.getTimezoneOffset(); // in minutes
  const offsetSign = offset >= 0 ? "+" : "-";
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(
    2,
    "0"
  );
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, "0");

  const formatted = `${datePart}, ${hours}:${minutes}:${seconds} (UTC${offsetSign}${offsetHours}:${offsetMinutes})`;

  return formatted;
}
