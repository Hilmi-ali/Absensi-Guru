import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAttendanceHistory } from "../services/historyService";
import BottomNav from "../components/BottomNav";

function History() {
  const { profile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile?.uid) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAttendanceHistory(profile.uid);
        setHistory(data);
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [profile]);

  const styles = {
    container: {
      width: "100%",
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: 20,
      paddingBottom: 110,
      boxSizing: "border-box",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    card: {
      background: "#fff",
      borderRadius: 15,
      padding: 16,
      marginBottom: 15,
      boxShadow: "0 2px 8px rgba(0,0,0,.08)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    status: {
      margin: 0,
      fontSize: 17,
    },
    date: {
      margin: 0,
      color: "#64748b",
      fontSize: 14,
    },
    info: {
      margin: "7px 0",
      color: "#475569",
    },
    empty: {
      textAlign: "center",
      marginTop: 50,
      color: "#64748b",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Riwayat Absensi</h2>

      {loading && <p>Memuat riwayat...</p>}

      {!loading && history.length === 0 && (
        <p style={styles.empty}>Belum ada riwayat absensi.</p>
      )}

      {!loading &&
        history.map((item) => {
          const hadir = item.status === "hadir";

          return (
            <div key={item.id} style={styles.card}>
              <div style={styles.header}>
                <h3 style={styles.status}>
                  {hadir ? "🟢 Hadir" : "🔴 Ditolak"}
                </h3>

                <p style={styles.date}>{item.tanggal || "-"}</p>
              </div>

              <p style={styles.info}>🕐 Jam : {item.jam || "-"}</p>

              <p style={styles.info}>📍 Jarak : {item.distance ?? "-"} meter</p>

              {!hadir && (
                <p style={{ ...styles.info, color: "#dc2626" }}>
                  Percobaan absensi di luar area sekolah.
                </p>
              )}
            </div>
          );
        })}

      <BottomNav />
    </div>
  );
}

export default History;
