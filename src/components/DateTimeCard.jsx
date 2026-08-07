function DateTimeCard({ clock }) {
  const styles = {
    card: {
      background: "#ffffff",
      borderRadius: 22,
      padding: "20px 22px",
      marginBottom: 16,
      boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
      border: "1px solid #F0F1F5",
    },
    row: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    title: {
      fontSize: 13,
      fontWeight: 600,
      color: "#667085",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
    },
    time: {
      fontSize: 40,
      fontWeight: 700,
      color: "#101828",
      letterSpacing: "-1px",
      fontVariantNumeric: "tabular-nums",
    },
    date: {
      marginTop: 4,
      color: "#667085",
      fontSize: 14,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#4F6BFF" strokeWidth="1.8" />
          <path
            d="M12 7v5l3.5 2"
            stroke="#4F6BFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span style={styles.title}>Jam Sekarang</span>
      </div>
      <div style={styles.time}>{clock.currentTime}</div>
      <div style={styles.date}>{clock.currentDate}</div>
    </div>
  );
}

export default DateTimeCard;
