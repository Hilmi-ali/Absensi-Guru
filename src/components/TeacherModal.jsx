import { useState, useEffect } from "react";

function TeacherModal({ open, onClose, onSave, teacher = null }) {
  const [form, setForm] = useState({
    nama: "",
    nip: "",
    email: "",
    role: "guru",
  });

  useEffect(() => {
    if (!open) return;

    if (teacher) {
      setForm({
        nama: teacher.nama || "",
        nip: teacher.nip || "",
        email: teacher.email || "",
        role: teacher.role || "guru",
      });
    } else {
      setForm({
        nama: "",
        nip: "",
        email: "",
        role: "guru",
      });
    }
  }, [open, teacher]);

  if (!open) return null;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    modal: {
      background: "#fff",
      width: 400,
      maxWidth: "90%",
      borderRadius: 12,
      padding: 20,
    },
    input: {
      width: "100%",
      padding: 10,
      marginBottom: 12,
      border: "1px solid #ddd",
      borderRadius: 8,
      boxSizing: "border-box",
    },
    btn: {
      padding: "10px 16px",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
    },
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{teacher ? "Edit Guru" : "Tambah Guru"}</h3>

        <input
          style={styles.input}
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="nip"
          placeholder="NIP"
          value={form.nip}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <select
          style={styles.input}
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="guru">Guru</option>
          <option value="admin">Admin</option>
        </select>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            style={{ ...styles.btn, background: "#ddd" }}
            onClick={onClose}
          >
            Batal
          </button>

          <button
            style={{ ...styles.btn, background: "#2563eb", color: "#fff" }}
            onClick={() => onSave(form)}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherModal;
