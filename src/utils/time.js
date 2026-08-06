// ===============================
// Format Jam
// ===============================
export function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ===============================
// Format Tanggal
// ===============================
export function formatDate(date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ===============================
// Countdown
// ===============================
export function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) {
    return "00:00:00";
  }

  const hour = Math.floor(totalSeconds / 3600);

  const minute = Math.floor((totalSeconds % 3600) / 60);

  const second = totalSeconds % 60;

  return [
    hour.toString().padStart(2, "0"),

    minute.toString().padStart(2, "0"),

    second.toString().padStart(2, "0"),
  ].join(":");
}
