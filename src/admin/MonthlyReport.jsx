import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getTeachers } from "../services/teacherService";
import { getMonthlyAttendance } from "../services/attendanceService";

function MonthlyReport() {
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);

        const [teacherData, attendanceData] = await Promise.all([
          getTeachers(),
          getMonthlyAttendance(year, month),
        ]);

        setTeachers(teacherData.filter((item) => item.role === "guru"));
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Gagal mengambil rekap:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [year, month]);

  const report = useMemo(() => {
    return teachers.map((teacher) => {
      const teacherAttendance = attendance.filter(
        (item) => item.uid === teacher.uid,
      );

      const hadir = teacherAttendance.filter(
        (item) => item.status === "hadir",
      ).length;

      const ditolak = teacherAttendance.filter(
        (item) =>
          item.status === "ditolak" ||
          item.status === "di luar area" ||
          item.status === "gagal",
      ).length;

      const totalAbsensi = teacherAttendance.length;

      return {
        ...teacher,
        hadir,
        ditolak,
        totalAbsensi,
      };
    });
  }, [teachers, attendance]);

  const filteredReport = report.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalGuru = teachers.length;

  const totalHadir = report.reduce((total, item) => total + item.hadir, 0);

  const totalDitolak = report.reduce((total, item) => total + item.ditolak, 0);

  const styles = {
    filters: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginBottom: 20,
    },
    input: {
      padding: 10,
      border: "1px solid #ddd",
      borderRadius: 8,
      boxSizing: "border-box",
    },
    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: 15,
      marginBottom: 20,
    },
    card: {
      background: "#fff",
      padding: 18,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,.05)",
    },
    cardTitle: {
      fontSize: 14,
      color: "#64748b",
      marginBottom: 8,
    },
    number: {
      fontSize: 25,
      fontWeight: "bold",
    },
    tableWrapper: {
      width: "100%",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      minWidth: 700,
      borderCollapse: "collapse",
      background: "#fff",
    },
    th: {
      padding: 12,
      background: "#f1f5f9",
      textAlign: "left",
    },
    td: {
      padding: 12,
      borderBottom: "1px solid #eee",
    },
  };

  return (
    <AdminLayout title="Rekap Bulanan">
      <div style={styles.filters}>
        <select
          style={styles.input}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          <option value={1}>Januari</option>
          <option value={2}>Februari</option>
          <option value={3}>Maret</option>
          <option value={4}>April</option>
          <option value={5}>Mei</option>
          <option value={6}>Juni</option>
          <option value={7}>Juli</option>
          <option value={8}>Agustus</option>
          <option value={9}>September</option>
          <option value={10}>Oktober</option>
          <option value={11}>November</option>
          <option value={12}>Desember</option>
        </select>

        <input
          type="number"
          style={styles.input}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />

        <input
          style={styles.input}
          placeholder="Cari nama guru..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Guru</div>
          <div style={styles.number}>{totalGuru}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Kehadiran</div>
          <div style={styles.number}>{totalHadir}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Percobaan Ditolak</div>
          <div style={styles.number}>{totalDitolak}</div>
        </div>
      </div>

      {loading ? (
        <p>Memuat rekap...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Nama Guru</th>
                <th style={styles.th}>NIP</th>
                <th style={styles.th}>Hadir</th>
                <th style={styles.th}>Ditolak</th>
                <th style={styles.th}>Total Absensi</th>
              </tr>
            </thead>

            <tbody>
              {filteredReport.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan="6">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredReport.map((item, index) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{index + 1}</td>

                    <td style={styles.td}>{item.nama || "-"}</td>

                    <td style={styles.td}>{item.nip || "-"}</td>

                    <td style={styles.td}>🟢 {item.hadir}</td>

                    <td style={styles.td}>🔴 {item.ditolak}</td>

                    <td style={styles.td}>{item.totalAbsensi}</td>
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

export default MonthlyReport;
