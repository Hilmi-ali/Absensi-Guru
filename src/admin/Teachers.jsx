import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import TeacherModal from "../components/TeacherModal";
import {
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "../services/teacherService";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState(null);

  async function loadTeachers() {
    const data = await getTeachers();
    setTeachers(data);
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  async function handleSave(data) {
    if (selectedTeacher) {
      await updateTeacher(selectedTeacher.id, data);
    } else {
      await addTeacher(data);
    }

    setSelectedTeacher(null);
    setOpen(false);
    loadTeachers();
  }

  function handleEdit(item) {
    setSelectedTeacher(item);
    setOpen(true);
  }

  async function handleDelete(item) {
    if (!window.confirm("Hapus guru ini?")) return;

    await deleteTeacher(item.id);

    loadTeachers();
  }

  const filtered = teachers.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.nama?.toLowerCase().includes(keyword) ||
      item.nip?.toLowerCase().includes(keyword)
    );
  });

  const styles = {
    top: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    input: {
      padding: 10,
      width: 250,
      borderRadius: 8,
      border: "1px solid #ddd",
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: 8,
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
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
    <AdminLayout title="Data Guru">
      <div style={styles.top}>
        <input
          style={styles.input}
          placeholder="Cari nama / NIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button style={styles.button} onClick={() => setOpen(true)}>
          + Tambah Guru
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nama</th>
            <th style={styles.th}>NIP</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.nama}</td>
              <td style={styles.td}>{item.nip}</td>
              <td style={styles.td}>{item.email}</td>
              <td style={styles.td}>{item.role}</td>
              <td style={styles.td}>{item.active ? "Aktif" : "Nonaktif"}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    marginRight: 8,
                    cursor: "pointer",
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TeacherModal
        open={open}
        teacher={selectedTeacher}
        onClose={() => {
          setOpen(false);
          setSelectedTeacher(null);
        }}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default Teachers;
