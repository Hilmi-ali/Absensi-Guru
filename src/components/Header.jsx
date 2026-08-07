import { FaBars } from "react-icons/fa";

function Header({ title, setMobileOpen }) {
  const styles = {
    header: {
      height: 65,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      boxShadow: "0 2px 8px rgba(0,0,0,.08)",
    },
    menu: {
      fontSize: 22,
      cursor: "pointer",
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
    },
  };

  return (
    <div style={styles.header}>
      <FaBars style={styles.menu} onClick={() => setMobileOpen(true)} />

      <div style={styles.title}>{title}</div>
    </div>
  );
}

export default Header;
