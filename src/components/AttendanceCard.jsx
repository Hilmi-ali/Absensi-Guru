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
    statusTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#101828" },
    label: { fontSize: 13, color: "#667085", marginBottom: 2 },
    value: {
      fontSize: 14,
      fontWeight: 600,
      color: "#101828",
      marginBottom: 14,
    },
    countdown: {
      fontSize: 34,
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
    },
    button: {
      width: "100%",
      padding: 16,
      border: "none",
      borderRadius: 16,
      background: "linear-gradient(135deg, #17C787 0%, #0F9D63 100%)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: "0.2px",
      cursor: "pointer",
      boxShadow: "0 10px 20px -8px rgba(15, 157, 99, 0.55)",
      transition: "transform 0.15s ease",
    },
    buttonDisabled: {
      background: "#D1FADF",
      color: "#12B76A",
      boxShadow: "none",
      cursor: "default",
    },
  };

  return (
    <div style={styles.card}>
      <style>{`
        .attend-btn:not(:disabled):hover { transform: translateY(-1px); }
        .attend-btn:not(:disabled):active { transform: translateY(0); }
      `}</style>

      {clock.status === "before" && (
        <>
          <div style={styles.statusRow}>
            <div style={styles.statusIcon("#FEF3E2")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#F59E0B"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 7v5l3 2"
                  stroke="#F59E0B"
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
            <div style={styles.statusIcon("#E7F7EF")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#12B76A"
                  strokeWidth="1.8"
                />
                <path
                  d="M8.5 12.5l2.2 2.2L15.5 9.5"
                  stroke="#12B76A"
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

          <div style={styles.infoBox}>
            {location.insideArea
              ? "Anda berada di area sekolah"
              : "Anda berada di luar area sekolah"}
          </div>

          {todayAttendance?.status === "hadir" ? (
            <button
              className="attend-btn"
              style={{ ...styles.button, ...styles.buttonDisabled }}
              disabled
            >
              ✔ Sudah Hadir
            </button>
          ) : (
            <button
              className="attend-btn"
              style={styles.button}
              onClick={onAttend}
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "HADIR"}
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

          <div style={styles.label}>Jam berakhir</div>
          <div style={styles.value}>{settings.closeTime}</div>
        </>
      )}
    </div>
  );
}

export default AttendanceCard;
