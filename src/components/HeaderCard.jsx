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
      background:
        "linear-gradient(135deg, #4F6BFF 0%, #3450E0 60%, #6D3FE0 100%)",
      color: "white",
      padding: "24px 22px",
      borderRadius: 24,
      marginBottom: 16,
      boxShadow: "0 16px 32px -14px rgba(52, 80, 224, 0.55)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      gap: 16,
    },
    glow: {
      position: "absolute",
      top: -40,
      right: -30,
      width: 140,
      height: 140,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.12)",
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 16,
      background: "rgba(255,255,255,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      fontWeight: 700,
      flexShrink: 0,
      border: "1px solid rgba(255,255,255,0.3)",
    },
    title: {
      margin: 0,
      fontSize: 13,
      opacity: 0.85,
      fontWeight: 500,
    },
    name: {
      marginTop: 2,
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: "-0.2px",
    },
    role: {
      marginTop: 3,
      fontSize: 13,
      opacity: 0.85,
      display: "inline-block",
      background: "rgba(255,255,255,0.16)",
      padding: "2px 10px",
      borderRadius: 999,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.glow} />
      <div style={styles.avatar}>{initials || "🙂"}</div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={styles.title}>Selamat Datang </p>
        <div style={styles.name}>{profile?.nama}</div>
        <div style={styles.role}>{profile?.role}</div>
      </div>
    </div>
  );
}

export default HeaderCard;
