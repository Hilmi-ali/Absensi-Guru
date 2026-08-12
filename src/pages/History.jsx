import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAttendanceHistory } from "../services/historyService";
import BottomNav from "../components/BottomNav";
import HeaderCard from "../components/HeaderCard";

function History() {
  const { profile } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    async function load() {
      if (!profile?.uid) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAttendanceHistory(profile.uid);

        setHistory(data);

        if (data.length > 0) {
          const latest = data[0];

          if (latest.tanggal) {
            const parts = latest.tanggal.split("-");

            if (parts.length === 3) {
              setSelectedMonth(`${parts[0]}-${parts[1]}`);
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [profile]);

  const availableMonths = [
    ...new Set(
      history
        .map((item) => {
          if (!item.tanggal) return null;

          const parts = item.tanggal.split("-");

          if (parts.length !== 3) return null;

          return `${parts[0]}-${parts[1]}`;
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => b.localeCompare(a));

  const filteredHistory = history.filter((item) => {
    if (!selectedMonth || !item.tanggal) return false;

    const parts = item.tanggal.split("-");

    if (parts.length !== 3) return false;

    return `${parts[0]}-${parts[1]}` === selectedMonth;
  });

  function formatMonth(value) {
    if (!value) return "Pilih bulan";

    const [year, month] = value.split("-");

    const date = new Date(Number(year), Number(month) - 1, 1);

    return date.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }

  function formatDayNumber(tanggal) {
    if (!tanggal) return "-";
    const parts = tanggal.split("-");
    if (parts.length !== 3) return "-";
    return parts[2];
  }

  function formatMonthAbbr(tanggal) {
    if (!tanggal) return "";
    const parts = tanggal.split("-");
    if (parts.length !== 3) return "";
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );
    return date.toLocaleDateString("id-ID", { month: "short" });
  }

  function formatWeekday(tanggal) {
    if (!tanggal) return "-";
    const parts = tanggal.split("-");
    if (parts.length !== 3) return "-";
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );
    return date.toLocaleDateString("id-ID", { weekday: "long" });
  }

  const totalTerlambat = filteredHistory.filter(
    (item) => item.status === "terlambat",
  ).length;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F5F6FA",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },

    container: {
      maxWidth: 480,
      margin: "0 auto",
      minHeight: "100vh",
      padding: 16,
      paddingTop: 20,
      paddingBottom: 100,
      boxSizing: "border-box",
    },

    stickyTop: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "#F5F6FA",
      paddingTop: 4,
      paddingBottom: 6,
      marginTop: -4,
    },
    periodCard: {
      position: "relative",
      zIndex: 2,
      marginTop: -20,
      background: "#FFFFFF",
      borderRadius: "10px 10px 18px 18px",
      border: "1px solid #F0F1F5",
      borderTop: "none",
      boxShadow: "0 10px 24px -16px rgba(16,24,40,0.22)",
      overflow: "hidden",
    },

    periodTop: {
      padding: "13px 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    monthLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      minWidth: 0,
    },

    monthIcon: {
      width: 28,
      height: 28,
      borderRadius: 9,
      background: "#FCEEDA",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    monthLabel: {
      fontSize: 10,
      fontWeight: 600,
      color: "#98A2B3",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
      marginBottom: 1,
    },

    monthValue: {
      fontSize: 12,
      fontWeight: 700,
      color: "#1E2A47",
    },

    selectWrap: {
      position: "relative",
      flexShrink: 0,
    },

    monthSelect: {
      appearance: "none",
      WebkitAppearance: "none",
      border: "1px solid #E4E7EC",
      background: "#F9FAFB",
      color: "#344054",
      borderRadius: 9,
      padding: "6px 26px 6px 10px",
      fontSize: 11.5,
      fontWeight: 600,
      outline: "none",
      cursor: "pointer",
      maxWidth: 118,
    },

    selectChevron: {
      position: "absolute",
      right: 8,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "#98A2B3",
    },

    summaryRow: {
      display: "flex",
      alignItems: "stretch",
      borderTop: "1px solid #F0F1F5",
    },

    summaryItem: {
      flex: 1,
      padding: "9px 15px",
      display: "flex",
      alignItems: "baseline",
      gap: 6,
    },

    summaryDivider: {
      width: 1,
      background: "#F0F1F5",
      margin: "9px 0",
    },

    summaryLabel: {
      fontSize: 10.5,
      color: "#98A2B3",
      fontWeight: 500,
    },

    summaryValue: {
      fontSize: 15,
      fontWeight: 700,
      color: "#1E2A47",
      letterSpacing: "-0.2px",
    },
    listCard: {
      background: "#FFFFFF",
      border: "1px solid #F0F1F5",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(16,24,40,0.04)",
      overflow: "hidden",
    },

    row: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 13px",
      borderBottom: "1px solid #F5F6F9",
    },

    rowLast: {
      borderBottom: "none",
    },

    rowIconHadir: {
      width: 23,
      height: 23,
      flexShrink: 0,
      background: "#046b14",
      clipPath: "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    rowIconTerlambat: {
      width: 19,
      height: 19,
      flexShrink: 0,
      background: "#E8A33D",
      borderRadius: 6,
      transform: "rotate(45deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 3px",
    },

    rowIconTerlambatInner: {
      transform: "rotate(-45deg)",
      display: "flex",
    },

    rowMain: {
      flex: 1,
      minWidth: 0,
    },

    rowTitle: {
      fontSize: 12.5,
      fontWeight: 700,
      color: "#1E2A47",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    rowSubtitle: {
      marginTop: 1,
      fontSize: 11,
      color: "#98A2B3",
    },

    rowRight: {
      textAlign: "right",
      flexShrink: 0,
    },

    rowStatus: (status) => ({
      fontSize: 11.5,
      fontWeight: 700,
      color: status === "hadir" ? "#046b14" : "#B54708",
    }),

    rowDistance: {
      marginTop: 1,
      fontSize: 10.5,
      color: "#98A2B3",
    },

    loading: {
      background: "#FFFFFF",
      border: "1px solid #EAECF0",
      borderRadius: 16,
      padding: "28px 16px",
      textAlign: "center",
      color: "#667085",
      fontSize: 13.5,
    },

    empty: {
      background: "#FFFFFF",
      border: "1px solid #EAECF0",
      borderRadius: 18,
      padding: "44px 20px",
      textAlign: "center",
      color: "#667085",
    },

    emptyIcon: {
      width: 52,
      height: 52,
      margin: "0 auto 14px",
      borderRadius: 15,
      background: "#EEF2FF",
      color: "#3450E0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    emptyTitle: {
      margin: 0,
      fontSize: 14.5,
      fontWeight: 700,
      color: "#1E2A47",
    },

    emptyText: {
      margin: "5px 0 0",
      fontSize: 12.5,
      color: "#98A2B3",
    },

    sectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: "#98A2B3",
      textTransform: "uppercase",
      letterSpacing: "0.4px",
      margin: "12px 4px 8px",
    },
  };

  function renderRowIcon(status) {
    if (status === "hadir") {
      return (
        <div style={styles.rowIconHadir}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.2 4L19 7"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }

    return (
      <div style={styles.rowIconTerlambat}>
        <div style={styles.rowIconTerlambatInner}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1.6" fill="#FFFFFF" />
            <path
              d="M12 12L12 6"
              stroke="#FFFFFF"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <path
              d="M12 12L16.5 14.5"
              stroke="#FFFFFF"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stickyTop}>
          <HeaderCard profile={profile} />

          <div style={styles.periodCard}>
            <div style={styles.periodTop}>
              <div style={styles.monthLeft}>
                <div style={styles.monthIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="4"
                      y="5"
                      width="16"
                      height="15"
                      rx="3"
                      stroke="#D9861A"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M4 9.5h16M8 3.5v3M16 3.5v3"
                      stroke="#D9861A"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={styles.monthValue}>
                    RIWAYAT <br /> ABSENSI
                  </div>
                </div>
              </div>

              <div style={styles.selectWrap}>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={styles.monthSelect}
                >
                  {availableMonths.length === 0 ? (
                    <option value="">Belum ada data</option>
                  ) : (
                    availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {formatMonth(month)}
                      </option>
                    ))
                  )}
                </select>
                <span style={styles.selectChevron}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {!loading && history.length > 0 && (
              <div style={styles.summaryRow}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryValue}>
                    {filteredHistory.length}
                  </span>
                  <span style={styles.summaryLabel}>Hadir bulan ini</span>
                </div>
                <div style={styles.summaryDivider} />
                <div style={styles.summaryItem}>
                  <span style={{ ...styles.summaryValue, color: "#B54708" }}>
                    {totalTerlambat}
                  </span>
                  <span style={styles.summaryLabel}>Terlambat</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && <div style={styles.loading}>Memuat riwayat absensi...</div>}

        {!loading && history.length === 0 && (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 8h8M8 12h8M8 16h5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p style={styles.emptyTitle}>Belum ada riwayat absensi</p>

            <p style={styles.emptyText}>
              Data kehadiran Anda akan muncul di sini.
            </p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <>
            <p style={styles.sectionLabel}>Riwayat</p>

            <div style={styles.listCard}>
              {filteredHistory.length === 0 ? (
                <div
                  style={{
                    padding: "32px 20px",
                    textAlign: "center",
                    color: "#98A2B3",
                    fontSize: 12.5,
                  }}
                >
                  Tidak ada riwayat pada bulan ini.
                </div>
              ) : (
                filteredHistory.map((item, index) => {
                  const isLast = index === filteredHistory.length - 1;
                  const status =
                    item.status === "hadir" ? "hadir" : "terlambat";

                  return (
                    <div
                      key={item.id}
                      style={{
                        ...styles.row,
                        ...(isLast ? styles.rowLast : {}),
                      }}
                    >
                      {renderRowIcon(status)}

                      <div style={styles.rowMain}>
                        <div style={styles.rowTitle}>
                          {formatWeekday(item.tanggal)},{" "}
                          {formatDayNumber(item.tanggal)}{" "}
                          {formatMonthAbbr(item.tanggal)}
                        </div>
                        <div style={styles.rowSubtitle}>
                          Jam {item.jam || "-"}
                        </div>
                      </div>

                      <div style={styles.rowRight}>
                        <div style={styles.rowStatus(status)}>
                          {status === "hadir" ? "Hadir" : "Terlambat"}
                        </div>
                        <div style={styles.rowDistance}>
                          {item.distance !== null && item.distance !== undefined
                            ? `${Number(item.distance).toFixed(0)} m`
                            : "-"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default History;
