import { useEffect, useState } from "react";
import { formatDate, formatTime, formatCountdown } from "../utils/time";
import { ATTENDANCE } from "../config/constants";

function getAttendanceStatus(now) {
  //Komentar untuk testing

  // const totalMinute = now.getHours() * 60 + now.getMinutes();
  // const openMinute = ATTENDANCE.openHour * 60 + ATTENDANCE.openMinute;
  // const closeMinute = ATTENDANCE.closeHour * 60 + ATTENDANCE.closeMinute;
  // if (totalMinute < openMinute) {
  //   return "before";
  // }
  // if (totalMinute >= openMinute && totalMinute <= closeMinute) {
  //   return "open";
  // }

  return "open";
}

export default function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const openTime = new Date(now);
  openTime.setHours(ATTENDANCE.openHour);
  openTime.setMinutes(ATTENDANCE.openMinute);
  openTime.setSeconds(0);

  const diff = Math.floor((openTime - now) / 1000);

  return {
    now,
    currentTime: formatTime(now),
    currentDate: formatDate(now),
    countdown: formatCountdown(diff),
    status: getAttendanceStatus(now),
  };
}
