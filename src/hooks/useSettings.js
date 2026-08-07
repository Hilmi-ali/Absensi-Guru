import { useEffect, useState } from "react";
import { subscribeAttendanceSettings } from "../services/settingService";

const DEFAULT_SETTINGS = {
  schoolName: "SMK Diponegoro Cipari",
  latitude: -7.366222,
  longitude: 108.808611,
  radius: 75,
  openTime: "06:30",
  closeTime: "07:17",
};

function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAttendanceSettings((data) => {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...data,
      });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    settings,
    loading,
  };
}

export default useSettings;
