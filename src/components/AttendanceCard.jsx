function AttendanceCard({
  settings,
  clock,
  location,
  todayAttendance,
  saving,
  onAttend,
}) {
  const styles = {
    card: {
      background: "#fff",
      borderRadius: 22,
      padding: 22,
      boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
      border: "1px solid #F0F1F5",
    },

    statusRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
    },

    statusIcon: (bg) => ({
      width: 36,
      height: 36,
      borderRadius: 12,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),

    statusTitle: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700,
      color: "#101828",
    },

    label: {
      fontSize: 13,
      color: "#667085",
      marginBottom: 2,
    },

    value: {
      fontSize: 14,
      fontWeight: 750,
      color: "#101828",
      marginBottom: 14,
    },

    countdown: {
      fontSize: 24,
      fontWeight: 700,
      color: "#101828",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.5px",
    },

    infoBox: {
      background: "#F9FAFB",
      borderRadius: 14,
      padding: "12px 14px",
      marginBottom: 16,
      fontSize: 13.5,
      color: "#475467",
      lineHeight: 1.5,
    },

    warningBox: {
      background: "#FFF",
      border: "1px solid #FFF",
      color: "#C2410C",
      borderRadius: 14,
      padding: "12px 14px",
      marginBottom: 16,
      fontSize: 13.5,
      lineHeight: 1.5,
    },

    successBox: {
      background: "#fff",
      border: "1px solid #fff",
      color: "#3450E0",
      borderRadius: 14,
      padding: "12px 14px",
      marginBottom: 16,
      fontSize: 13.5,
      lineHeight: 1.5,
    },

    lateBox: {
      background: "#FFFAEB",
      border: "1px solid #FEDF89",
      color: "#B54708",
      borderRadius: 14,
      padding: "12px 14px",
      marginBottom: 16,
      fontSize: 13.5,
      lineHeight: 1.5,
    },

    button: {
      width: "100%",
      padding: 16,
      border: "none",
      borderRadius: 16,
      background: "linear-gradient(135deg, #263863 0%, #3b5082 100%)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: "0.2px",
      cursor: "pointer",
      boxShadow: "0 10px 20px -8px rgba(52, 80, 224, 0.5)",
      transition: "transform 0.15s ease",
    },

    lateButton: {
      width: "100%",
      padding: 16,
      border: "none",
      borderRadius: 16,
      background: "linear-gradient(135deg, #F79009 0%, #DC6803 100%)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: "0.2px",
      cursor: "pointer",
      boxShadow: "0 10px 20px -8px rgba(220, 104, 3, 0.45)",
    },

    buttonDisabled: {
      background: "#EAECF0",
      color: "#98A2B3",
      boxShadow: "none",
      cursor: "default",
    },
  };

  const hasLocation =
    location?.latitude !== null &&
    location?.latitude !== undefined &&
    location?.longitude !== null &&
    location?.longitude !== undefined;

  const alreadyAttendance =
    todayAttendance?.status === "hadir" ||
    todayAttendance?.status === "terlambat";

  const gpsDisabled = !hasLocation || saving;

  return (
    <div style={styles.card}>
      <style>{`
        .attend-btn:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .attend-btn:not(:disabled):active {
          transform: translateY(0);
        }
      `}</style>

      {clock.status === "before" && (
        <>
          <div style={styles.statusRow}>
            <div style={styles.statusIcon("#EEF2FF")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#3450E0"
                  strokeWidth="1.8"
                />

                <path
                  d="M12 7v5l3 2"
                  stroke="#3450E0"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 style={styles.statusTitle}>Belum Dibuka</h3>
          </div>

          <div style={styles.label}>Jam mulai</div>

          <div style={styles.value}>{settings.openTime}</div>

          <div style={styles.label}>Dibuka dalam</div>

          <div style={styles.countdown}>{clock.countdown}</div>
        </>
      )}

      {clock.status === "open" && (
        <>
          <div style={styles.statusRow}>
            <div style={styles.statusIcon("#EEF2FF")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#3450E0"
                  strokeWidth="1.8"
                />

                <path
                  d="M8.5 12.5l2.2 2.2L15.5 9.5"
                  stroke="#3450E0"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 style={styles.statusTitle}>Absensi Dibuka</h3>
          </div>

          <div style={styles.label}>Jam Absen</div>

          <div style={styles.value}>
            {settings.openTime} - {settings.closeTime}
          </div>

          {/* GPS */}

          {!hasLocation ? (
            <div style={styles.warningBox}>
              📍 GPS belum tersedia.
              <br />
              Aktifkan lokasi untuk melakukan absensi.
            </div>
          ) : location.insideArea ? (
            <div style={styles.successBox}>
              {/* 📍 Anda berada di area sekolah. */}
            </div>
          ) : (
            <div style={styles.warningBox}>
              {/* ⚠️ Anda berada di luar area sekolah.
              <br />
              Jika tetap menekan tombol, percobaan akan dicatat sebagai{" "}
              <strong>absen</strong> di sistem admin. */}
            </div>
          )}

          {alreadyAttendance ? (
            <button
              className="attend-btn"
              style={{
                ...styles.button,
                ...styles.buttonDisabled,
              }}
              disabled
            >
              ✔{" "}
              {todayAttendance.status === "terlambat"
                ? "Terlambat Tersimpan"
                : "Sudah Hadir"}
            </button>
          ) : (
            <button
              className="attend-btn"
              style={
                gpsDisabled
                  ? {
                      ...styles.button,
                      ...styles.buttonDisabled,
                    }
                  : styles.button
              }
              onClick={onAttend}
              disabled={gpsDisabled}
            >
              {saving
                ? "Menyimpan..."
                : !hasLocation
                  ? "GPS Diperlukan"
                  : "HADIR"}
            </button>
          )}
        </>
      )}
      {clock.status === "late" && (
        <>
          <div style={styles.statusRow}>
            <div style={styles.statusIcon("#FFF4E5")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#F79009"
                  strokeWidth="1.8"
                />

                <path
                  d="M12 7v5l3 2"
                  stroke="#F79009"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 style={styles.statusTitle}>Absensi Terlambat</h3>
          </div>

          <div style={styles.label}>Batas Absensi</div>

          <div style={styles.value}>{settings.closeTime}</div>

          <div style={styles.lateBox}>
            ⚠️ Absensi normal berakhir. <br /> Anda masih dapat absen{" "}
            <strong>terlambat</strong> hingga <strong>12:00</strong>.
          </div>

          {!hasLocation ? (
            <div style={styles.warningBox}>
              📍 GPS belum tersedia.
              <br />
              Aktifkan lokasi untuk melakukan absensi.
            </div>
          ) : location.insideArea ? (
            <div style={styles.successBox}>
              {/* 📍 Anda berada di area sekolah. */}
            </div>
          ) : (
            <div style={styles.warningBox}>
              {/* ⚠️ Anda berada di luar area sekolah.
              <br />
              Percobaan akan tetap dicatat di sistem admin, tetapi tidak menjadi
              absensi guru. */}
            </div>
          )}

          {alreadyAttendance ? (
            <button
              className="attend-btn"
              style={{
                ...styles.button,
                ...styles.buttonDisabled,
              }}
              disabled
            >
              ✔{" "}
              {todayAttendance.status === "terlambat"
                ? "Terlambat Tersimpan"
                : "Sudah Hadir"}
            </button>
          ) : (
            <button
              className="attend-btn"
              style={
                gpsDisabled
                  ? {
                      ...styles.lateButton,
                      ...styles.buttonDisabled,
                    }
                  : styles.lateButton
              }
              onClick={onAttend}
              disabled={gpsDisabled}
            >
              {saving
                ? "Menyimpan..."
                : !hasLocation
                  ? "GPS Diperlukan"
                  : "ABSEN TERLAMBAT"}
            </button>
          )}
        </>
      )}

      {clock.status === "closed" && (
        <>
          <div style={styles.statusRow}>
            <div style={styles.statusIcon("#FEE4E2")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#F04438"
                  strokeWidth="1.8"
                />

                <path
                  d="M9 9l6 6M15 9l-6 6"
                  stroke="#F04438"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 style={styles.statusTitle}>Absensi Ditutup</h3>
          </div>

          <div style={styles.label}>Batas akhir absensi</div>

          <div style={styles.value}>12:00</div>

          <div style={styles.warningBox}>
            Absensi hari ini sudah ditutup.
            <br />
            Anda tidak dapat melakukan absensi lagi.
          </div>
        </>
      )}
    </div>
  );
}

export default AttendanceCard;
