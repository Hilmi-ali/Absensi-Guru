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
// import AppToast from "../components/AppToast";

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

  const [toast, setToast] = useState(null);

  function showToast(type, title, message) {
    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  }

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

    if (!profile?.uid) {
      showToast("error", "Data pengguna", "Data pengguna tidak ditemukan.");
      return;
    }

    if (!settings) {
      showToast(
        "error",
        "Pengaturan belum tersedia",
        "Pengaturan absensi belum tersedia.",
      );
      return;
    }

    if (clock.status === "before") {
      showToast(
        "warning",
        "Absensi belum dibuka",
        `Absensi mulai pukul ${settings.openTime}.`,
      );
      return;
    }

    if (clock.status === "closed") {
      showToast(
        "error",
        "Absensi ditutup",
        "Absensi hari ini sudah ditutup pada pukul 12:00.",
      );
      return;
    }

    if (
      todayAttendance?.status === "hadir" ||
      todayAttendance?.status === "terlambat"
    ) {
      return;
    }

    const hasLocation =
      location?.latitude !== null &&
      location?.latitude !== undefined &&
      location?.longitude !== null &&
      location?.longitude !== undefined;

    if (!hasLocation) {
      showToast(
        "warning",
        "Lokasi belum tersedia",
        "Aktifkan GPS dan izinkan akses lokasi untuk melakukan absensi.",
      );
      return;
    }

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

          clockStatus: clock.status,
        },
        settings,
      );

      if (!result.success) {
        if (result.error === "GPS_REQUIRED") {
          showToast(
            "warning",
            "GPS belum aktif",
            "Absensi tidak dicatat karena lokasi tidak tersedia.",
          );
          return;
        }

        if (result.alreadyExists) {
          const existingStatus = result.status;

          if (existingStatus === "hadir") {
            showToast(
              "success",
              "Sudah hadir",
              "Absensi Anda hari ini sudah tersimpan.",
            );
          } else if (existingStatus === "terlambat") {
            showToast(
              "success",
              "Sudah tercatat",
              "Absensi terlambat Anda hari ini sudah tersimpan.",
            );
          }

          const latestAttendance = await checkTodayAttendance(profile.uid);
          setTodayAttendance(latestAttendance);

          return;
        }

        showToast(
          "error",
          "Absensi gagal",
          "Absensi tidak dapat disimpan. Silakan coba lagi.",
        );

        return;
      }
      const latestAttendance = await checkTodayAttendance(profile.uid);

      setTodayAttendance(latestAttendance);

      if (result.status === "hadir") {
        showToast(
          "success",
          "Absensi berhasil",
          "Kehadiran Anda sudah tercatat.",
        );
        return;
      }

      if (result.status === "terlambat") {
        showToast(
          "warning",
          "Absensi terlambat",
          "Kehadiran Anda tetap tercatat sebagai terlambat.",
        );
        return;
      }

      if (result.status === "absen" && result.attempt) {
        showToast(
          "warning",
          "Di luar area sekolah",
          "Silakan berada di area sekolah untuk melakukan absensi.",
        );
        return;
      }
    } catch (error) {
      console.error("Gagal melakukan absensi:", error);

      showToast(
        "error",
        "Terjadi kesalahan",
        "Terjadi masalah saat melakukan absensi. Silakan coba lagi.",
      );
    } finally {
      setSaving(false);
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
  function getToastStyle(type) {
    if (type === "success") {
      return {
        background: "#F0FDF4",
        border: "#BBF7D0",
        iconBackground: "#DCFCE7",
        iconColor: "#16A34A",
        titleColor: "#166534",
        textColor: "#4D7C5A",
      };
    }

    if (type === "warning") {
      return {
        background: "#FFFBEB",
        border: "#FDE68A",
        iconBackground: "#FEF3C7",
        iconColor: "#D97706",
        titleColor: "#92400E",
        textColor: "#78716C",
      };
    }

    return {
      background: "#FEF2F2",
      border: "#FECACA",
      iconBackground: "#FEE2E2",
      iconColor: "#DC2626",
      titleColor: "#991B1B",
      textColor: "#78716C",
    };
  }

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

      {toast && (
        <>
          <style>{`
      @keyframes toastIn {
        from {
          opacity: 0;
          transform: translate(-50%, -12px);
        }

        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      @media (min-width: 600px) {
        .attendance-toast {
          left: auto !important;
          right: 24px !important;
          transform: none !important;
          animation-name: toastInDesktop !important;
        }
      }

      @keyframes toastInDesktop {
        from {
          opacity: 0;
          transform: translateY(-12px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>

          <div
            className="attendance-toast"
            style={{
              position: "fixed",
              zIndex: 99999,

              top: 18,
              left: "50%",

              width: "calc(100% - 32px)",
              maxWidth: 420,

              transform: "translateX(-50%)",

              display: "flex",
              alignItems: "flex-start",
              gap: 12,

              padding: "14px 16px",

              background: getToastStyle(toast.type).background,
              border: `1px solid ${getToastStyle(toast.type).border}`,

              borderRadius: 16,

              boxSizing: "border-box",

              boxShadow:
                "0 10px 30px rgba(16,24,40,0.12), 0 2px 8px rgba(16,24,40,0.06)",

              animation: "toastIn 0.22s ease-out",

              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {/* ICON */}
            <div
              style={{
                width: 34,
                height: 34,
                minWidth: 34,
                borderRadius: 10,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: getToastStyle(toast.type).iconBackground,
                color: getToastStyle(toast.type).iconColor,
              }}
            >
              {toast.type === "success" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.2 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {toast.type === "warning" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 8v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle cx="12" cy="16" r="1" fill="currentColor" />

                  <path
                    d="M10.3 4.8L3.2 17a2 2 0 001.7 3h14.2a2 2 0 001.7-3L13.7 4.8a2 2 0 00-3.4 0z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {toast.type === "error" && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 8l8 8M16 8l-8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            {/* CONTENT */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                paddingTop: 1,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: getToastStyle(toast.type).titleColor,
                  marginBottom: 3,
                }}
              >
                {toast.title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: getToastStyle(toast.type).textColor,
                }}
              >
                {toast.message}
              </div>
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setToast(null)}
              style={{
                width: 28,
                height: 28,
                minWidth: 28,

                border: "none",
                background: "transparent",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 8,

                cursor: "pointer",

                color: "#98A2B3",
                fontSize: 20,
                lineHeight: 1,
              }}
              aria-label="Tutup"
            >
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
