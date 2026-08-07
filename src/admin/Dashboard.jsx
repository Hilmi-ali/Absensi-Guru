import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getDashboardStats } from "../services/dashboardService";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID");

    async function load() {
      const result = await getDashboardStats(today);

      setData(result);
    }

    load();
  }, []);

  const styles = {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: 20,
      marginBottom: 30,
    },

    card: {
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,.08)",
    },

    number: {
      fontSize: 32,
      fontWeight: "bold",
      marginTop: 10,
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
    },

    th: {
      background: "#2563eb",
      color: "#fff",
      padding: 12,
    },

    td: {
      padding: 12,
      borderBottom: "1px solid #ddd",
    },
  };

  if (!data) {
    return <AdminLayout title="Dashboard">Loading...</AdminLayout>;
  }

  return (
    <AdminLayout title="Dashboard">
      <div style={styles.grid}>
        <div style={styles.card}>
          <div>Total Guru</div>
          <div style={styles.number}>{data.totalGuru}</div>
        </div>

        <div style={styles.card}>
          <div>Hadir Hari Ini</div>
          <div style={styles.number}>{data.hadir}</div>
        </div>

        <div style={styles.card}>
          <div>Belum Hadir</div>
          <div style={styles.number}>{data.belumHadir}</div>
        </div>

        <div style={styles.card}>
          <div>Percobaan Curang</div>
          <div style={styles.number}>{data.curang}</div>
        </div>
      </div>

      <h3>Absensi Hari Ini</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nama</th>

            <th style={styles.th}>Jam</th>

            <th style={styles.th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.attendance.map((item, index) => (
            <tr key={index}>
              <td style={styles.td}>{item.nama}</td>

              <td style={styles.td}>{item.jam}</td>

              <td style={styles.td}>
                {item.status === "hadir" ? "🟢 Hadir" : "🔴 Ditolak"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default Dashboard;
