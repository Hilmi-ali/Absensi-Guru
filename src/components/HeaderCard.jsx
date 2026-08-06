function HeaderCard({ profile }) {
  const styles = {
    card: {
      background: "#2563eb",

      color: "white",

      padding: 20,

      borderRadius: 20,

      marginBottom: 20,

      boxShadow: "0 5px 20px rgba(0,0,0,.15)",
    },

    title: {
      margin: 0,

      fontSize: 16,

      opacity: 0.9,
    },

    name: {
      marginTop: 10,

      fontSize: 25,

      fontWeight: "bold",
    },

    role: {
      opacity: 0.85,

      marginTop: 5,
    },
  };

  return (
    <div style={styles.card}>
      <p style={styles.title}>Selamat Datang 👋</p>

      <div style={styles.name}>{profile?.nama}</div>

      <div style={styles.role}>{profile?.role}</div>
    </div>
  );
}

export default HeaderCard;
