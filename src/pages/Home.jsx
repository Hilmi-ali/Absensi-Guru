import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useClock from "../hooks/useClock";
import useLocation from "../hooks/useLocation";
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
  const clock = useClock();
  const location = useLocation();
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

    const success = await saveAttendance({
      uid: profile.uid,
      nama: profile.nama,
      role: profile.role,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      distance: location.distance,
      insideArea: location.insideArea,
    });

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

  const styles = {
    container: {
      maxWidth: 480,

      margin: "0 auto",

      minHeight: "100vh",

      background: "#f3f4f6",

      padding: 20,

      paddingBottom: 90,

      boxSizing: "border-box",
    },
  };

  return (
    <div style={styles.container}>
      <HeaderCard profile={profile} />

      <DateTimeCard clock={clock} />

      <LocationCard location={location} />

      <AttendanceCard
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
