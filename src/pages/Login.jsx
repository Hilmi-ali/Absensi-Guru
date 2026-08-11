import { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase/config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      boxSizing: "border-box",
      background:
        "radial-gradient(circle at 15% -10%, #E7ECFF 0%, rgba(231,236,255,0) 55%), radial-gradient(circle at 100% 0%, #EAF7F0 0%, rgba(234,247,240,0) 45%), #F6F7FB",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      width: "100%",
      maxWidth: 380,
      background: "#FFFFFF",
      borderRadius: 28,
      padding: "40px 28px 32px",
      boxSizing: "border-box",
      boxShadow:
        "0 1px 2px rgba(16,24,40,0.04), 0 20px 40px -12px rgba(16,24,40,0.12)",
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 17,
      margin: "0 auto 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #FFF 70%, #fffac6 100%)",
      boxShadow: "0 8px 20px -6px rgba(90, 90, 90, 0.55)",
    },
    title: {
      margin: 0,
      textAlign: "center",
      fontSize: 22,
      fontWeight: 800,
      color: "#101828",
      letterSpacing: "-0.3px",
    },
    subtitle: {
      margin: "6px 0 28px",
      textAlign: "center",
      fontSize: 14,
      fontWeight: 600,
      color: "#0d2b6c",
    },
    field: { marginBottom: 14 },
    inputWrap: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    icon: {
      position: "absolute",
      left: 14,
      display: "flex",
      color: "#98A2B3",
    },
    input: {
      width: "100%",
      padding: "13px 14px 13px 42px",
      fontSize: 15,
      borderRadius: 14,
      border: "1.5px solid #E4E7EC",
      background: "#F9FAFB",
      color: "#101828",
      boxSizing: "border-box",
      outline: "none",
    },
    button: {
      width: "100%",
      marginTop: 8,
      padding: 15,
      background: loading
        ? "linear-gradient(135deg, #97A6F5 0%, #7F92EE 100%)"
        : "linear-gradient(135deg, #4F6BFF 0%, #3450E0 100%)",
      color: "#fff",
      border: "none",
      borderRadius: 14,
      cursor: loading ? "default" : "pointer",
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: "0.2px",
      boxShadow: "0 10px 20px -8px rgba(63, 91, 245, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    },
  };

  async function handleLogin() {
    if (loading) return;

    try {
      setLoading(true);

      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <style>{`
        .app-input:focus {
          border-color: #4F6BFF !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 4px rgba(79,107,255,0.12);
        }
        .app-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 24px -8px rgba(63, 91, 245, 0.65);
        }
        .app-btn:not(:disabled):active {
          transform: translateY(0);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .app-spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div style={styles.card}>
        <div style={styles.logo}>
          <img
            src="/dipoLogo.png"
            alt="Logo"
            style={{ width: 62, height: 62, objectFit: "contain" }}
          />
        </div>

        <h2 style={styles.title}>LOGIN</h2>
        <p style={styles.subtitle}>Absensi Guru</p>

        <div style={styles.field}>
          <div style={styles.inputWrap}>
            <span style={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6.5l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              className="app-input"
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.field}>
          <div style={styles.inputWrap}>
            <span style={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="10.5"
                  width="14"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 10.5V8a4 4 0 018 0v2.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              className="app-input"
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          className="app-btn"
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading && <span className="app-spinner" />}
          {loading ? "Memproses..." : "LOGIN"}
        </button>
      </div>
    </div>
  );
}

export default Login;
