export function getUpcomingHour() {
  const now = new Date();

  // Format current time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const currentFormatted = formatTime(now);

  // Create date for next top-of-hour
  const nextHour = new Date(now);
  nextHour.setMinutes(0, 0, 0); // Set to :00:00
  nextHour.setHours(nextHour.getHours() + 1); // Add 1 hour

  const nextFormatted = formatTime(nextHour);

  return [currentFormatted, nextFormatted];
}
