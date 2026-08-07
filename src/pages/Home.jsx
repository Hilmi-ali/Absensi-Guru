import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useClock from "../hooks/useClock";
import useLocation from "../hooks/useLocation";
import useSettings from "../hooks/useSettings";
import HeaderCard from "../components/HeaderCard";
import DateTimeCard from "../components/DateTimeCard";
import LocationCard from "../components/LocationCard";
import AttendanceCard from "../components/AttendanceCard";
import {
  checkTodayAttendance,
  saveAttendance,
} from "../services/attendanceService";
import BottomNav from "../components/BottomNav";

function Home() {
  const { profile } = useAuth();
  const { settings, loading: loadingSettings } = useSettings();
  const clock = useClock(settings);
  const location = useLocation(settings);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAttendance() {
      if (!profile?.uid) return;

      const result = await checkTodayAttendance(profile.uid);
      setTodayAttendance(result);
    }

    loadAttendance();
  }, [profile]);

  async function handleAttendance() {
    if (saving) return;

    if (todayAttendance?.status === "hadir") {
      return;
    }

    setSaving(true);

    const success = await saveAttendance(
      {
        uid: profile.uid,
        nama: profile.nama,
        role: profile.role,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        distance: location.distance,
        insideArea: location.insideArea,
      },
      settings,
    );

    setSaving(false);

    if (!success) {
      alert("Gagal menyimpan absensi.");
      return;
    }

    const data = await checkTodayAttendance(profile.uid);

    setTodayAttendance(data);

    if (location.insideArea) {
      alert("Absensi berhasil.");
    } else {
      alert("Anda harus berada di lingkungan sekolah.");
    }
  }

  if (loadingSettings || !settings) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          color: "#667085",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid #E4E7EC",
            borderTopColor: "#4F6BFF",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 14 }}>Memuat...</span>
      </div>
    );
  }

  const styles = {
    container: {
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#F5F6FA",
      padding: 16,
      paddingTop: 20,
      paddingBottom: 100,
      boxSizing: "border-box",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  };

  return (
    <div style={styles.container}>
      <HeaderCard profile={profile} />

      <DateTimeCard clock={clock} />

      <LocationCard location={location} />

      <AttendanceCard
        settings={settings}
        clock={clock}
        location={location}
        todayAttendance={todayAttendance}
        saving={saving}
        onAttend={handleAttendance}
      />

      <BottomNav />
    </div>
  );
}

export default Home;
