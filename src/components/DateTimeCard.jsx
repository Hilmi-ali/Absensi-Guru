function DateTimeCard({ clock }) {
  const styles = {
    card: {
      position: "relative",
      zIndex: 2,
      marginTop: -8,
      marginBottom: 16,
      background: "#ffffff",
      borderRadius: 24,
      padding: "14px 20px 16px",
      boxShadow: "0 16px 34px -18px rgba(16,24,40,0.28)",
      border: "1px solid #F0F1F5",
      textAlign: "center",
    },
    label: {
      fontSize: 13.5,
      fontWeight: 700,
      color: "#1E2A47",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: 10,
    },
    timeBox: {
      display: "inline-block",
      background: "linear-gradient(135deg, #EEF1FF 0%, #c1ccff 100%)",
      color: "#2e4c93",
      borderRadius: 18,
      padding: "10px 18px",
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: "-0.5px",
      fontVariantNumeric: "tabular-nums",
    },
    date: {
      marginTop: 10,
      color: "#667085",
      fontSize: 12,
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.label}>ABSENSI</div>
      <div style={styles.timeBox}>{clock.currentTime}</div>
      <div style={styles.date}>{clock.currentDate}</div>
    </div>
  );
}

export default DateTimeCard;
