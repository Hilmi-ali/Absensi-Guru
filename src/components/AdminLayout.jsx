import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      background: "#f1f5f9",
    },
    content: {
      flex: 1,
    },
    body: {
      padding: 20,
    },
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div style={styles.content}>
        <Header title={title} setMobileOpen={setMobileOpen} />

        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
