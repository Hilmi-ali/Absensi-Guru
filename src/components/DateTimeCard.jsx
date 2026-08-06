function DateTimeCard({ clock }) {
  const styles = {
    card: {
      background: "#ffffff",

      borderRadius: 20,

      padding: 20,

      marginBottom: 20,

      boxShadow: "0 3px 10px rgba(0,0,0,.1)",
    },

    title: {
      fontSize: 16,

      color: "#666",

      marginBottom: 15,
    },

    time: {
      fontSize: 38,

      fontWeight: "bold",

      color: "#2563eb",
    },

    date: {
      marginTop: 10,

      color: "#666",

      fontSize: 15,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>Jam Sekarang</div>

      <div style={styles.time}>{clock.currentTime}</div>

      <div style={styles.date}>{clock.currentDate}</div>
    </div>
  );
}

export default DateTimeCard;
