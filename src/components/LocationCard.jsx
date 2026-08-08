function LocationCard({ location }) {
  const { loading, distance, insideArea, accuracy, error } = location;

  const styles = {
    card: {
      background: "#fff",
      borderRadius: 20,
      padding: "14px 16px",
      marginBottom: 16,
      boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
      border: "1px solid #F0F1F5",
    },
    center: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#667085",
      fontSize: 13.5,
    },
    row: {
      display: "flex",
      alignItems: "center",
      gap: 14,
    },
    preview: (ok) => ({
      position: "relative",
      width: 54,
      height: 54,
      borderRadius: 14,
      flexShrink: 0,
      overflow: "hidden",
      background: ok
        ? "linear-gradient(135deg, #E8F0FF 0%, #DCE6FF 100%)"
        : "linear-gradient(135deg, #FFF1EE 0%, #FFE4DE 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    previewDot: (ok, top, left) => ({
      position: "absolute",
      top,
      left,
      width: 3,
      height: 3,
      borderRadius: "50%",
      background: ok ? "#A9BCFF" : "#FFC2B4",
    }),
    info: { flex: 1, minWidth: 0 },
    captionRow: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    caption: (ok) => ({
      fontSize: 13.5,
      fontWeight: 700,
      color: ok ? "#2A3FCC" : "#D0402A",
    }),
    stats: {
      fontSize: 12.5,
      color: "#98A2B3",
    },
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
        <div style={{ color: "#F04438", fontSize: 13.5 }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        {/* Preview lokasi kecil (dekoratif) */}
        <div style={styles.preview(insideArea)}>
          <div style={styles.previewDot(insideArea, 8, 10)} />
          <div style={styles.previewDot(insideArea, 14, 34)} />
          <div style={styles.previewDot(insideArea, 34, 14)} />
          <div style={styles.previewDot(insideArea, 38, 38)} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.8 12 21 12 21z"
              fill={insideArea ? "#3450E0" : "#F04438"}
            />
            <circle cx="12" cy="9.5" r="2.3" fill="#fff" />
          </svg>
        </div>

        <div style={styles.info}>
          <div style={styles.captionRow}>
            <span style={styles.caption(insideArea)}>
              {insideArea ? "Dalam area sekolah" : "Di luar area sekolah"}
            </span>
          </div>
          <div style={styles.stats}>
            Jarak {distance?.toFixed(1)} m &nbsp;•&nbsp; Akurasi{" "}
            {accuracy?.toFixed(1)} m
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
