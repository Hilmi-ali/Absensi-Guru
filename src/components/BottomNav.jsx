import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaUser } from "react-icons/fa";

function BottomNav() {
  const styles = {
    nav: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: 480,
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-around",
      padding: "12px 0",
      background: "#fff",
      borderTop: "1px solid #ddd",
    },
    link: {
      textDecoration: "none",
      color: "#888",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: 13,
    },
    active: {
      color: "#2563eb",
    },
  };

  return (
    <div style={styles.nav}>
      <NavLink
        to="/"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        <FaHome size={20} />
        Beranda
      </NavLink>

      <NavLink
        to="/history"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        <FaClipboardList size={20} />
        Riwayat
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) =>
          isActive ? { ...styles.link, ...styles.active } : styles.link
        }
      >
        <FaUser size={20} />
        Profil
      </NavLink>
    </div>
  );
}

export default BottomNav;
