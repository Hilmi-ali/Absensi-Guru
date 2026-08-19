import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getTeachers } from "../services/teacherService";
import { getMonthlyAttendance } from "../services/attendanceService";
import { exportMonthlyReport } from "../utils/exportMonthlyReport";

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

        const guruData = teacherData.filter(
          (item) => item.role?.toLowerCase() === "guru",
        );

        setTeachers(guruData);
        setAttendance(attendanceData);

        console.log("=== REKAP BULANAN ===");
        console.log("Guru:", guruData);
        console.log("Attendance:", attendanceData);
      } catch (error) {
        console.error("Gagal mengambil rekap:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [year, month]);

  const totalHariSekolah = useMemo(() => {
    const today = new Date();

    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;

    const lastDay = isCurrentMonth
      ? today.getDate()
      : new Date(year, month, 0).getDate();

    let total = 0;

    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month - 1, day);

      const dayOfWeek = date.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        total++;
      }
    }

    return total;
  }, [year, month]);

  const report = useMemo(() => {
    const attendanceMap = {};

    attendance.forEach((item) => {
      const key = item.uid || item.nama?.trim().toLowerCase();

      if (!key) return;

      if (!attendanceMap[key]) {
        attendanceMap[key] = [];
      }

      attendanceMap[key].push(item);
    });

    console.log("ATTENDANCE MAP:", attendanceMap);

    return teachers.map((teacher) => {
      let teacherAttendance = [];

      if (teacher.uid && attendanceMap[teacher.uid]) {
        teacherAttendance = attendanceMap[teacher.uid];
      }

      if (teacherAttendance.length === 0 && teacher.nama) {
        const nameKey = teacher.nama.trim().toLowerCase();

        teacherAttendance = attendanceMap[nameKey] || [];
      }

      const hadir = teacherAttendance.filter(
        (item) => item.status?.toLowerCase() === "hadir",
      ).length;

      const terlambat = teacherAttendance.filter(
        (item) => item.status?.toLowerCase() === "terlambat",
      ).length;

      const attempts = teacherAttendance.filter(
        (item) =>
          item.source === "attendance_attempts" || item.attempt === true,
      );

      const absen = Math.max(0, totalHariSekolah - hadir - terlambat);

      const deviceIds = [
        ...new Set(
          teacherAttendance
            .map((item) => item.device?.deviceId)
            .filter(Boolean),
        ),
      ];

      const deviceCount = deviceIds.length;

      const multipleDevices = deviceCount > 1;

      return {
        ...teacher,

        hadir,
        terlambat,
        absen,

        attempts: attempts.length,

        deviceCount,
        multipleDevices,

        totalHariSekolah,

        totalRecord: teacherAttendance.length,
      };
    });
  }, [teachers, attendance, totalHariSekolah]);

  const filteredReport = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return report;
    }

    return report.filter((item) => item.nama?.toLowerCase().includes(keyword));
  }, [report, search]);

  const totalGuru = teachers.length;
  const totalHadir = report.reduce((total, item) => total + item.hadir, 0);
  const totalTerlambat = report.reduce(
    (total, item) => total + item.terlambat,
    0,
  );

  const totalAbsen = report.reduce((total, item) => total + item.absen, 0);

  const handleExport = async () => {
    try {
      if (filteredReport.length === 0) {
        alert("Tidak ada data yang dapat diekspor.");
        return;
      }

      await exportMonthlyReport(filteredReport, year, month);
    } catch (error) {
      console.error("Gagal export Excel:", error);
      alert("Gagal membuat file Excel.");
    }
  };

  const styles = {
    filters: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 16,
    },

    input: {
      height: 38,
      padding: "0 10px",
      border: "1px solid #D0D5DD",
      borderRadius: 8,
      background: "#FFFFFF",
      color: "#344054",
      fontSize: 12.5,
      outline: "none",
      boxSizing: "border-box",
    },

    search: {
      flex: 1,
      minWidth: 180,
    },

    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 10,
      marginBottom: 16,
    },

    card: {
      background: "#FFFFFF",
      border: "1px solid #EAECF0",
      borderRadius: 10,
      padding: "11px 13px",
      boxShadow: "0 1px 2px rgba(16,24,40,0.03)",
      minWidth: 0,
    },

    cardTitle: {
      fontSize: 11,
      color: "#667085",
      marginBottom: 4,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    number: {
      fontSize: 20,
      fontWeight: 750,
      lineHeight: 1,
    },

    tableWrapper: {
      width: "100%",
      overflowX: "auto",
      background: "#FFFFFF",
      border: "1px solid #EAECF0",
      borderRadius: 10,
      boxShadow: "0 1px 2px rgba(16,24,40,0.03)",
    },

    table: {
      width: "100%",
      minWidth: 650,
      borderCollapse: "collapse",
    },

    th: {
      padding: "9px 11px",
      background: "#F9FAFB",
      borderBottom: "1px solid #EAECF0",
      color: "#667085",
      fontSize: 10.5,
      fontWeight: 700,
      textAlign: "left",
      whiteSpace: "nowrap",
    },

    td: {
      padding: "9px 11px",
      borderBottom: "1px solid #F2F4F7",
      color: "#344054",
      fontSize: 12,
      whiteSpace: "nowrap",
    },

    status: {
      fontWeight: 700,
      fontSize: 12.5,
    },

    normal: {
      color: "#027A48",
      fontSize: 11,
      fontWeight: 600,
    },

    warning: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 7px",
      borderRadius: 6,
      background: "#FFF4E5",
      color: "#B54708",
      fontSize: 10.5,
      fontWeight: 650,
    },

    loading: {
      padding: 30,
      textAlign: "center",
      color: "#667085",
      fontSize: 13,
    },
    exportButton: {
      height: 38,
      padding: "0 14px",
      border: "none",
      borderRadius: 8,
      background: "#15803D",
      color: "#FFFFFF",
      fontSize: 12.5,
      fontWeight: 650,
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
  };

  return (
    <AdminLayout title="Rekap Bulanan">
      <div>
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
            style={{
              ...styles.input,
              width: 90,
            }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <input
            type="text"
            style={{
              ...styles.input,
              ...styles.search,
            }}
            placeholder="Cari nama guru..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={handleExport}
            style={styles.exportButton}
          >
            Export Excel
          </button>
        </div>

        {/* STATS */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Total Guru</div>

            <div
              style={{
                ...styles.number,
                color: "#101828",
              }}
            >
              {totalGuru}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Kehadiran</div>

            <div
              style={{
                ...styles.number,
                color: "#027A48",
              }}
            >
              {totalHadir}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Terlambat</div>

            <div
              style={{
                ...styles.number,
                color: "#B54708",
              }}
            >
              {totalTerlambat}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Absen</div>

            <div
              style={{
                ...styles.number,
                color: "#B42318",
              }}
            >
              {totalAbsen}
            </div>
          </div>
        </div>

        {/* TABLE */}

        {loading ? (
          <div style={styles.tableWrapper}>
            <div style={styles.loading}>Memuat rekap absensi...</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>No</th>

                  <th style={styles.th}>Nama</th>

                  <th style={styles.th}>Kehadiran</th>

                  <th style={styles.th}>Terlambat</th>

                  <th style={styles.th}>Absen</th>

                  <th style={styles.th}>Keterangan</th>
                </tr>
              </thead>

              <tbody>
                {filteredReport.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan={6}>
                      Tidak ada data guru.
                    </td>
                  </tr>
                ) : (
                  filteredReport.map((item, index) => (
                    <tr key={item.id || item.uid || index}>
                      <td style={styles.td}>{index + 1}</td>

                      <td style={styles.td}>
                        <strong>{item.nama || "-"}</strong>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            color: "#027A48",
                          }}
                        >
                          {item.hadir}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            color: "#B54708",
                          }}
                        >
                          {item.terlambat}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.status,
                            color: "#B42318",
                          }}
                        >
                          {item.absen}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {item.multipleDevices ? (
                          <span style={styles.warning}>
                            ⚠ {item.deviceCount} perangkat
                          </span>
                        ) : (
                          <span style={styles.normal}>✓ Normal</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default MonthlyReport;
