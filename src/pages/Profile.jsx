import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Profile() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const confirmLogout = window.confirm("Yakin ingin keluar dari akun?");

    if (!confirmLogout) return;

    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Logout gagal. Silakan coba lagi.");
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F7F8FA",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },

    container: {
      width: "100%",
      maxWidth: 480,
      minHeight: "100vh",
      margin: "0 auto",
      padding: "20px 16px 110px",
      boxSizing: "border-box",
    },

    card: {
      background: "#FFFFFF",
      border: "1px solid #EAECF0",
      borderRadius: 22,
      padding: "32px 20px 24px",
      boxShadow: "0 4px 14px rgba(16, 24, 40, 0.05)",
    },

    avatar: {
      width: 82,
      height: 82,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #4F6BFF, #3450E0)",
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      boxShadow: "0 8px 18px rgba(79, 107, 255, 0.25)",
    },

    name: {
      textAlign: "center",
      fontSize: 21,
      fontWeight: 750,
      color: "#101828",
      letterSpacing: "-0.3px",
      margin: 0,
    },

    role: {
      textAlign: "center",
      color: "#667085",
      fontSize: 13.5,
      marginTop: 5,
      marginBottom: 30,
    },

    divider: {
      height: 1,
      background: "#EAECF0",
      marginBottom: 22,
    },

    item: {
      marginBottom: 18,
    },

    label: {
      fontSize: 11.5,
      color: "#98A2B3",
      marginBottom: 5,
      fontWeight: 600,
    },

    value: {
      fontSize: 15,
      fontWeight: 600,
      color: "#344054",
    },

    logout: {
      width: "100%",
      padding: "13px 14px",
      marginTop: 52,
      border: "1px solid #FECACA",
      borderRadius: 12,
      background: "#DC2626",
      color: "#FEF2F2",
      fontWeight: 650,
      fontSize: 14,
      cursor: "pointer",
    },
  };

  const initial = profile?.nama?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.avatar}>{initial}</div>

          <h2 style={styles.name}>{profile?.nama || "Pengguna"}</h2>

          <div style={styles.role}>{profile?.role || "Guru"}</div>

          <div style={styles.divider} />

          <div style={styles.item}>
            <div style={styles.label}>Nama Lengkap</div>

            <div style={styles.value}>{profile?.nama || "-"}</div>
          </div>

          <div style={styles.item}>
            <div style={styles.label}>Peran</div>

            <div style={styles.value}>{profile?.role || "-"}</div>
          </div>

          <button type="button" style={styles.logout} onClick={handleLogout}>
            KELUAR
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile;
