import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ===============================
// Membuat Document ID
// ===============================

export function getAttendanceId(uid) {
  return `${getToday()}_${uid}`;
}

// ===============================
// Mengecek apakah hari ini sudah absen
// ===============================

export async function checkTodayAttendance(uid) {
  try {
    const attendanceId = getAttendanceId(uid);
    const ref = doc(db, "attendance", attendanceId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return snapshot.data();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function saveAttendance(data) {
  try {
    const attendanceId = getAttendanceId(data.uid);
    const ref = doc(db, "attendance", attendanceId);

    await setDoc(ref, {
      uid: data.uid,
      nama: data.nama,
      role: data.role,
      tanggal: getToday(),
      jam: new Date().toLocaleTimeString("id-ID"),
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      distance: Number(data.distance.toFixed(2)),
      insideArea: data.insideArea,
      status: data.insideArea ? "hadir" : "ditolak",
      attempt: !data.insideArea,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
