import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaUser } from "react-icons/fa";

function BottomNav() {
  const styles = {
    wrapper: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      pointerEvents: "none",
    },
    nav: {
      width: "100%",
      maxWidth: 480,
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "9px 10px calc(9px + env(safe-area-inset-bottom))",
      boxSizing: "border-box",
      background: "rgba(255,255,255,.96)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderTop: "1px solid #e5e7eb",
      boxShadow: "0 -3px 15px rgba(0,0,0,.08)",
      pointerEvents: "auto",
    },
    link: {
      flex: 1,
      textDecoration: "none",
      color: "#94a3b8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      padding: "5px 0",
      fontSize: 12,
      fontWeight: 500,
      transition: "all .2s ease",
    },
    icon: {
      fontSize: 20,
    },
    active: {
      color: "#2563eb",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.wrapper}>
      <nav style={styles.nav}>
        <NavLink
          to="/home"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          <FaHome style={styles.icon} />
          <span>Beranda</span>
        </NavLink>

        <NavLink
          to="/history"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          <FaClipboardList style={styles.icon} />
          <span>Riwayat</span>
        </NavLink>

        <NavLink
          to="/profile"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          <FaUser style={styles.icon} />
          <span>Profil</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default BottomNav;
