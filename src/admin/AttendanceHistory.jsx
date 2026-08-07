import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAttendanceHistory } from "../services/attendanceService";

function AttendanceHistory() {
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data = await getAttendanceHistory();

        setAttendance(data);
      } catch (error) {
        console.error("Gagal mengambil riwayat absensi:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ===============================
  // FILTER
  // ===============================

  const filtered = attendance.filter((item) => {
    const matchName = item.nama?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || item.status === status;

    const matchDate = !date || item.tanggal === date;

    return matchName && matchStatus && matchDate;
  });

  // ===============================
  // STYLE
  // ===============================

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
      boxSizing: "border-box",
      minHeight: 40,
    },

    tableWrapper: {
      width: "100%",
      overflowX: "auto",
      borderRadius: 12,
    },

    table: {
      width: "100%",
      minWidth: 850,
      borderCollapse: "collapse",
      background: "#fff",
    },

    th: {
      background: "#f3f4f6",
      padding: 12,
      textAlign: "left",
      whiteSpace: "nowrap",
    },

    td: {
      padding: 12,
      borderBottom: "1px solid #eee",
      whiteSpace: "nowrap",
    },

    badge: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
    },

    hadir: {
      background: "#ECFDF3",
      color: "#027A48",
    },

    terlambat: {
      background: "#FFFAEB",
      color: "#B54708",
    },

    absen: {
      background: "#F2F4F7",
      color: "#475467",
    },

    empty: {
      textAlign: "center",
      padding: 30,
      color: "#667085",
    },

    attempt: {
      fontSize: 12,
      color: "#667085",
      marginTop: 4,
    },
  };

  // ===============================
  // STATUS BADGE
  // ===============================

  function renderStatus(item) {
    if (item.status === "hadir") {
      return (
        <span
          style={{
            ...styles.badge,
            ...styles.hadir,
          }}
        >
          🟢 Hadir
        </span>
      );
    }

    if (item.status === "terlambat") {
      return (
        <span
          style={{
            ...styles.badge,
            ...styles.terlambat,
          }}
        >
          🟠 Terlambat
        </span>
      );
    }

    return (
      <span
        style={{
          ...styles.badge,
          ...styles.absen,
        }}
      >
        ⚫ Absen
      </span>
    );
  }

  return (
    <AdminLayout title="Riwayat Absensi">
      {/* ===============================
          FILTER
      =============================== */}

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
          <option value="all">Semua Status</option>

          <option value="hadir">Hadir</option>

          <option value="terlambat">Terlambat</option>

          <option value="absen">Absen</option>
        </select>
      </div>

      {/* ===============================
          TABLE
      =============================== */}

      {loading ? (
        <p>Memuat riwayat...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tanggal</th>

                <th style={styles.th}>Jam</th>

                <th style={styles.th}>Guru</th>

                <th style={styles.th}>Status</th>

                <th style={styles.th}>Jarak</th>

                <th style={styles.th}>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td style={styles.empty} colSpan="6">
                    Tidak ada data absensi.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={`${item.source}_${item.id}`}>
                    <td style={styles.td}>{item.tanggal || "-"}</td>

                    <td style={styles.td}>{item.jam || "-"}</td>

                    <td style={styles.td}>{item.nama || "-"}</td>

                    <td style={styles.td}>{renderStatus(item)}</td>

                    <td style={styles.td}>{item.distance ?? "-"} m</td>

                    <td style={styles.td}>
                      {item.status === "absen"
                        ? "Percobaan di luar area sekolah"
                        : item.status === "terlambat"
                          ? "Absensi setelah jam normal"
                          : "Absensi normal"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AttendanceHistory;
