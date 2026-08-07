import { useEffect, useState } from "react";
import { calculateDistance } from "../utils/haversine";

export default function useLocation(settings) {
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [distance, setDistance] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [insideArea, setInsideArea] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!settings) return;
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung GPS");

      setLoading(false);

      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;

        const lng = position.coords.longitude;

        const acc = position.coords.accuracy;

        const meter = calculateDistance(
          lat,
          lng,
          settings.latitude,
          settings.longitude,
        );
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        setDistance(meter);
        setInsideArea(meter <= settings.radius);
        setLoading(false);
      },

      (error) => {
        setError(error.message);

        setLoading(false);
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [settings]);

  return {
    loading,
    latitude,
    longitude,
    distance,
    accuracy,
    insideArea,
    error,
  };
}
