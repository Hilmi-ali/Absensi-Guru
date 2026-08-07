import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaHistory,
  FaCalendarAlt,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

function Sidebar({ mobileOpen, setMobileOpen, onLogout }) {
  const menus = [
    { title: "Dashboard", path: "/admin", icon: <FaHome /> },
    { title: "Data Guru", path: "/admin/teachers", icon: <FaUsers /> },
    { title: "Riwayat Absensi", path: "/admin/history", icon: <FaHistory /> },
    { title: "Rekap Bulanan", path: "/admin/report", icon: <FaCalendarAlt /> },
    {
      title: "Pengaturan",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  const styles = {
    sidebar: {
      width: 250,
      background: "#1e293b",
      color: "#fff",
      minHeight: "100vh",
      padding: 20,
      boxSizing: "border-box",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 30,
    },
    link: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: "#fff",
      textDecoration: "none",
      padding: "12px 14px",
      borderRadius: 10,
      marginBottom: 10,
    },
    active: {
      background: "#2563eb",
    },
    logout: {
      marginTop: 30,
      width: "100%",
      padding: 12,
      border: "none",
      borderRadius: 10,
      background: "#dc2626",
      color: "#fff",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.title}>Admin Panel</div>

      {menus.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
          onClick={() => setMobileOpen(false)}
        >
          {menu.icon}
          {menu.title}
        </NavLink>
      ))}

      <button style={styles.logout} onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
