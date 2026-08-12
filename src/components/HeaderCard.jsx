function HeaderCard({ profile }) {
  const initials = (profile?.nama || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const styles = {
    card: {
      position: "relative",
      background: "#1E2A47",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1.4px)",
      backgroundSize: "13px 13px",
      color: "#fff",
      padding: "20px 20px 30px",
      borderRadius: "22px 22px 10px 10px",
      marginBottom: -20,
      overflow: "hidden",
    },
    topRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    profileRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      minWidth: 0,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 12,
      background: "rgba(232, 163, 61, 0.18)",
      border: "1px solid rgba(232, 163, 61, 0.5)",
      color: "#F0B36B",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 15,
      fontWeight: 700,
      flexShrink: 0,
    },
    name: {
      fontSize: 15.5,
      fontWeight: 700,
      letterSpacing: "-0.1px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    role: {
      marginTop: 2,
      fontSize: 12,
      color: "rgba(255,255,255,0.6)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    bell: {
      width: 36,
      height: 36,
      borderRadius: 11,
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      position: "relative",
    },
    bellDot: {
      position: "absolute",
      top: 7,
      right: 8,
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#E8A33D",
    },
    divider: {
      width: 68,
      height: 2.5,
      borderRadius: 2,
      background: "#1E2A47",
      marginBottom: 4,
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
      color: "#faf9f8",
      marginTop: 18,
      marginBottom: 4,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.profileRow}>
          <div style={styles.avatar}>{initials || "?"}</div>
          <div style={{ minWidth: 0 }}>
            <div style={styles.name}>{profile?.nama}</div>
            <div style={styles.role}>{profile?.role}</div>
          </div>
        </div>

        <div style={styles.bell}>
          <span style={styles.bellDot} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3a5 5 0 00-5 5v2.6c0 .5-.16 1-.47 1.4L5 14.5c-.6.8-.02 1.9.98 1.9h12.04c1 0 1.58-1.1.98-1.9l-1.53-2.5a2.3 2.3 0 01-.47-1.4V8a5 5 0 00-5-5z"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M10 19a2 2 0 004 0"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div style={styles.eyebrow}></div>
      <div style={styles.divider} />
    </div>
  );
}

export default HeaderCard;
