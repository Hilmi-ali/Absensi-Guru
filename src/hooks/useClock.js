import { useEffect, useMemo, useState } from "react";
import { formatDate, formatTime, formatCountdown } from "../utils/time";
import useSettings from "./useSettings";

function getAttendanceStatus(now, settings) {
  if (!settings) return "loading";

  const [openHour, openMinute] = settings.openTime.split(":").map(Number);

  const [closeHour, closeMinute] = settings.closeTime.split(":").map(Number);

  const totalMinute = now.getHours() * 60 + now.getMinutes();
  const openMinuteTotal = openHour * 60 + openMinute;
  const closeMinuteTotal = closeHour * 60 + closeMinute;

  // ==========================
  // Untuk Development
  // ==========================
  return "open";

  // ==========================
  // Aktifkan saat Production
  // ==========================

  // if (totalMinute < openMinuteTotal) {
  //   return "before";
  // }

  // if (
  //   totalMinute >= openMinuteTotal &&
  //   totalMinute <= closeMinuteTotal
  // ) {
  //   return "open";
  // }

  // return "after";
}

export default function useClock(settings) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const openTime = useMemo(() => {
    if (!settings) return null;

    const [hour, minute] = settings.openTime.split(":").map(Number);

    const time = new Date(now);
    time.setHours(hour);
    time.setMinutes(minute);
    time.setSeconds(0);
    time.setMilliseconds(0);

    return time;
  }, [settings, now]);

  const diff = openTime ? Math.floor((openTime - now) / 1000) : 0;

  return {
    now,
    settings,
    currentTime: formatTime(now),
    currentDate: formatDate(now),
    countdown: formatCountdown(diff),
    status: getAttendanceStatus(now, settings),
  };
}
