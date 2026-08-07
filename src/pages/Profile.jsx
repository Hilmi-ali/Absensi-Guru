import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Profile() {
  const { profile, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const confirmLogout = window.confirm("Yakin ingin keluar?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert("Gagal logout.");
      console.log(error);
    }
  }

  const styles = {
    container: {
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: 20,
      paddingBottom: 90,
      boxSizing: "border-box",
    },
    card: {
      background: "#fff",
      borderRadius: 20,
      padding: 20,
      boxShadow: "0 2px 10px rgba(0,0,0,.08)",
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: "50%",
      background: "#2563eb",
      color: "#fff",
      fontSize: 34,
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
    },
    name: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: "bold",
    },
    role: {
      textAlign: "center",
      color: "#666",
      marginBottom: 25,
    },
    item: {
      marginBottom: 18,
    },
    label: {
      fontSize: 13,
      color: "#888",
    },
    value: {
      fontSize: 16,
      fontWeight: 500,
    },
    logout: {
      width: "100%",
      padding: 14,
      marginTop: 25,
      border: "none",
      borderRadius: 12,
      background: "#dc2626",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      cursor: "pointer",
    },
  };

  const initial = profile?.nama?.charAt(0)?.toUpperCase() || "?";

  return (
    <div style={styles.container}>
      <h2>Profil</h2>

      <div style={styles.card}>
        <div style={styles.avatar}>{initial}</div>

        <div style={styles.name}>{profile?.nama}</div>

        <div style={styles.role}>{profile?.role}</div>

        <div style={styles.item}>
          <div style={styles.label}>Email</div>
          <div style={styles.value}>{currentUser?.email}</div>
        </div>

        <div style={styles.item}>
          <div style={styles.label}>Versi Aplikasi</div>
          <div style={styles.value}>v1.0.0</div>
        </div>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile;
