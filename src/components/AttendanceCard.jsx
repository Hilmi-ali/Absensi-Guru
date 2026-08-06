function AttendanceCard({
  clock,
  location,
  todayAttendance,
  saving,
  onAttend,
}) {
  const styles = {
    card: {
      background: "#fff",

      borderRadius: 20,

      padding: 20,

      boxShadow: "0 3px 10px rgba(0,0,0,.1)",
    },

    button: {
      width: "100%",

      padding: 16,

      border: "none",

      borderRadius: 12,

      background: "#16a34a",

      color: "#fff",

      fontWeight: "bold",

      fontSize: 18,

      cursor: "pointer",
    },
  };

  return (
    <div style={styles.card}>
      {clock.status === "before" && (
        <>
          <h3>🟡 Belum Dibuka</h3>

          <p>Dibuka dalam</p>

          <h2>{clock.countdown}</h2>
        </>
      )}

      {clock.status === "open" && (
        <>
          <h3>🟢 Absensi Dibuka</h3>

          <p>
            {location.insideArea
              ? "Anda berada di area sekolah"
              : "Anda berada di luar area sekolah"}
          </p>

          {todayAttendance?.status === "hadir" ? (
            <button
              style={{
                ...styles.button,
                background: "#16a34a",
              }}
              disabled
            >
              ✔ Sudah Hadir
            </button>
          ) : (
            <button style={styles.button} onClick={onAttend} disabled={saving}>
              {saving ? "Menyimpan..." : "HADIR"}
            </button>
          )}
        </>
      )}

      {clock.status === "closed" && (
        <>
          <h3>🔴 Absensi Ditutup</h3>
        </>
      )}
    </div>
  );
}

export default AttendanceCard;
