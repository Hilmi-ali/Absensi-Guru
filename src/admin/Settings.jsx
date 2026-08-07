import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import useSettings from "../hooks/useSettings";
import { updateAttendanceSettings } from "../services/settingService";

const DEFAULT_SETTINGS = {
  schoolName: "SMK Diponegoro Cipari",
  latitude: -7.366222,
  longitude: 108.808611,
  radius: 75,
  openTime: "06:30",
  closeTime: "07:17",
};

function Settings() {
  const { settings, loading } = useSettings();
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        ...DEFAULT_SETTINGS,
        ...settings,
      });
    }
  }, [settings]);

  async function save() {
    try {
      setSaving(true);
      await updateAttendanceSettings(form);
      alert("Pengaturan berhasil disimpan.");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  }

  const styles = {
    container: {
      maxWidth: 700,
      background: "#fff",
      padding: 20,
      borderRadius: 12,
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: 10,
      marginBottom: 15,
      border: "1px solid #ddd",
      borderRadius: 8,
      boxSizing: "border-box",
    },
    button: {
      padding: "12px 18px",
      border: "none",
      borderRadius: 8,
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
    },
  };

  if (loading) {
    return (
      <AdminLayout title="Pengaturan">
        <p>Memuat pengaturan...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan">
      <div style={styles.container}>
        <label style={styles.label}>Nama Sekolah</label>
        <input
          style={styles.input}
          value={form.schoolName}
          onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
        />

        <label style={styles.label}>Latitude</label>
        <input
          type="number"
          step="any"
          style={styles.input}
          value={form.latitude}
          onChange={(e) =>
            setForm({ ...form, latitude: Number(e.target.value) })
          }
        />

        <label style={styles.label}>Longitude</label>
        <input
          type="number"
          step="any"
          style={styles.input}
          value={form.longitude}
          onChange={(e) =>
            setForm({ ...form, longitude: Number(e.target.value) })
          }
        />

        <label style={styles.label}>Radius Absensi (meter)</label>
        <input
          type="number"
          min="1"
          style={styles.input}
          value={form.radius}
          onChange={(e) => setForm({ ...form, radius: Number(e.target.value) })}
        />

        <label style={styles.label}>Jam Mulai Absensi</label>
        <input
          type="time"
          style={styles.input}
          value={form.openTime}
          onChange={(e) => setForm({ ...form, openTime: e.target.value })}
        />

        <label style={styles.label}>Jam Tutup Absensi</label>
        <input
          type="time"
          style={styles.input}
          value={form.closeTime}
          onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
        />

        <button
          style={{
            ...styles.button,
            opacity: saving ? 0.7 : 1,
          }}
          onClick={save}
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </AdminLayout>
  );
}

export default Settings;
