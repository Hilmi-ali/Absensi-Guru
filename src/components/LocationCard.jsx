function LocationCard({ location }) {
  const { loading, distance, insideArea, accuracy, error } = location;

  const styles = {
    card: {
      background: "#fff",
      borderRadius: 22,
      padding: "20px 22px",
      marginBottom: 16,
      boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
      border: "1px solid #F0F1F5",
    },
    center: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#667085",
      fontSize: 14,
    },
    row: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 14,
    },
    title: {
      fontSize: 13,
      fontWeight: 600,
      color: "#667085",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
    },
    badge: (ok) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      background: ok ? "#ECFDF3" : "#FEF3F2",
      color: ok ? "#12B76A" : "#F04438",
      marginBottom: 14,
    }),
    dot: (ok) => ({
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: ok ? "#12B76A" : "#F04438",
    }),
    statsRow: { display: "flex", gap: 12 },
    stat: {
      flex: 1,
      background: "#F9FAFB",
      borderRadius: 14,
      padding: "12px 14px",
    },
    statLabel: { fontSize: 12, color: "#98A2B3", marginBottom: 4 },
    statValue: { fontSize: 16, fontWeight: 700, color: "#101828" },
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.center}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "2px solid #E4E7EC",
              borderTopColor: "#4F6BFF",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Mengambil lokasi...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.card}>
        <div style={{ color: "#F04438", fontSize: 14 }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.8 12 21 12 21z"
            stroke="#4F6BFF"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="9.5" r="2.4" stroke="#4F6BFF" strokeWidth="1.8" />
        </svg>
        <span style={styles.title}>Lokasi</span>
      </div>

      <div style={styles.badge(insideArea)}>
        <span style={styles.dot(insideArea)} />
        {insideArea ? "Dalam Area" : "Di Luar Area"}
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Jarak</div>
          <div style={styles.statValue}>{distance?.toFixed(1)} meter</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Akurasi</div>
          <div style={styles.statValue}>{accuracy?.toFixed(1)} meter</div>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
