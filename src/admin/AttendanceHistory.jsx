import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAttendanceHistory } from "../services/attendanceService";

function AttendanceHistory() {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getAttendanceHistory();
    setAttendance(data);
  }

  const filtered = attendance.filter((item) => {
    const matchName = item.nama?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || item.status === status;

    const matchDate = !date || item.tanggal === date;

    return matchName && matchStatus && matchDate;
  });

  const styles = {
    top: {
      display: "flex",
      gap: 10,
      marginBottom: 20,
      flexWrap: "wrap",
    },

    input: {
      padding: 10,
      border: "1px solid #ddd",
      borderRadius: 8,
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
    },

    th: {
      background: "#f3f4f6",
      padding: 12,
      textAlign: "left",
    },

    td: {
      padding: 12,
      borderBottom: "1px solid #eee",
    },
  };

  return (
    <AdminLayout title="Riwayat Absensi">
      <div style={styles.top}>
        <input
          style={styles.input}
          placeholder="Cari Guru..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          style={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          style={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="hadir">Hadir</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tanggal</th>
            <th style={styles.th}>Jam</th>
            <th style={styles.th}>Guru</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Jarak</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.tanggal}</td>

              <td style={styles.td}>{item.jam}</td>

              <td style={styles.td}>{item.nama}</td>

              <td style={styles.td}>
                {item.status === "hadir" ? "🟢 Hadir" : "🔴 Ditolak"}
              </td>

              <td style={styles.td}>{item.distance} m</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AttendanceHistory;
