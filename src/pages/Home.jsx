import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useClock from "../hooks/useClock";
import useLocation from "../hooks/useLocation";
import useSettings from "../hooks/useSettings";

import HeaderCard from "../components/HeaderCard";
import DateTimeCard from "../components/DateTimeCard";
import LocationCard from "../components/LocationCard";
import AttendanceCard from "../components/AttendanceCard";
import BottomNav from "../components/BottomNav";

import {
  checkTodayAttendance,
  saveAttendance,
} from "../services/attendanceService";

function Home() {
  const { profile } = useAuth();

  const { settings, loading: loadingSettings } = useSettings();

  const clock = useClock(settings);
  const location = useLocation(settings);

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD ABSENSI HARI INI
  // =========================================================

  useEffect(() => {
    async function loadAttendance() {
      if (!profile?.uid) return;

      const result = await checkTodayAttendance(profile.uid);

      setTodayAttendance(result);
    }

    loadAttendance();
  }, [profile]);

  // =========================================================
  // HANDLE ABSENSI
  // =========================================================

  async function handleAttendance() {
    if (saving) return;

    if (!profile?.uid) {
      alert("Data pengguna tidak ditemukan.");
      return;
    }

    if (!settings) {
      alert("Pengaturan absensi belum tersedia.");
      return;
    }

    // =======================================================
    // 1. CEGAH ABSEN SEBELUM JAM BUKA
    // =======================================================

    if (clock.status === "before") {
      alert(`Absensi belum dibuka. Mulai pukul ${settings.openTime}.`);
      return;
    }

    // =======================================================
    // 2. CEGAH ABSEN SETELAH JAM 12
    // =======================================================

    if (clock.status === "closed") {
      alert("Absensi hari ini sudah ditutup.");
      return;
    }

    // =======================================================
    // 3. CEGAH SPAM JIKA SUDAH HADIR / TERLAMBAT
    // =======================================================

    if (
      todayAttendance?.status === "hadir" ||
      todayAttendance?.status === "terlambat"
    ) {
      return;
    }

    // =======================================================
    // 4. GPS WAJIB AKTIF
    // =======================================================

    const hasLocation =
      location?.latitude !== null &&
      location?.latitude !== undefined &&
      location?.longitude !== null &&
      location?.longitude !== undefined;

    if (!hasLocation) {
      alert("GPS belum aktif. Aktifkan lokasi terlebih dahulu.");
      return;
    }

    // =======================================================
    // 5. SIMPAN ABSENSI / ATTEMPT
    // =======================================================

    setSaving(true);

    try {
      const result = await saveAttendance(
        {
          uid: profile.uid,
          nama: profile.nama,
          role: profile.role,

          latitude: location.latitude,
          longitude: location.longitude,

          accuracy: location.accuracy,
          distance: location.distance,

          insideArea: location.insideArea,

          // Penting:
          // status waktu ditentukan oleh useClock
          clockStatus: clock.status,
        },
        settings,
      );

      // =====================================================
      // 6. JIKA GAGAL
      // =====================================================

      if (!result.success) {
        if (result.error === "GPS_REQUIRED") {
          alert("GPS belum aktif. Absensi tidak dicatat.");
          return;
        }

        alert("Gagal menyimpan absensi.");
        return;
      }

      // =====================================================
      // 7. UPDATE DATA ABSENSI HARI INI
      // =====================================================

      const latestAttendance = await checkTodayAttendance(profile.uid);

      setTodayAttendance(latestAttendance);

      // =====================================================
      // 8. HASIL ABSENSI
      // =====================================================

      if (result.status === "hadir") {
        alert("Absensi berhasil. Status: Hadir.");
        return;
      }

      if (result.status === "terlambat") {
        alert("Absensi berhasil. Status: Terlambat.");
        return;
      }

      // =====================================================
      // 9. DI LUAR RADIUS
      // =====================================================

      if (result.status === "absen") {
        alert(
          "Lokasi Anda berada di luar radius sekolah. " +
            "Percobaan absensi telah tercatat.",
        );
      }
    } catch (error) {
      console.error("Gagal melakukan absensi:", error);

      alert("Terjadi kesalahan saat melakukan absensi.");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING SETTINGS
  // =========================================================

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
        <style>
          {`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>

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

  // =========================================================
  // UI
  // =========================================================

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
