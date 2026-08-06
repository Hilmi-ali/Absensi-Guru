import { Link } from "react-router-dom";

function BottomNav() {
  const styles = {
    nav: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 65,
      background: "#ffffff",
      borderTop: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },

    link: {
      textDecoration: "none",
      color: "#444",
      fontSize: 14,
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.nav}>
      <Link style={styles.link} to="/home">
        Home
      </Link>

      <Link style={styles.link} to="/history">
        Riwayat
      </Link>

      <Link style={styles.link} to="/profile">
        Profil
      </Link>
    </div>
  );
}

export default BottomNav;
