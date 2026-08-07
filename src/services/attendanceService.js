import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
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

export async function saveAttendance(data, settings) {
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

      schoolName: settings.schoolName,
      schoolLatitude: settings.latitude,
      schoolLongitude: settings.longitude,
      schoolRadius: settings.radius,
      openTime: settings.openTime,
      closeTime: settings.closeTime,

      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const COLLECTION = "attendance";

export async function getAttendanceHistory() {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getMonthlyAttendance(year, month) {
  const snapshot = await getDocs(collection(db, COLLECTION));

  const prefix = `${year}-${String(month).padStart(2, "0")}`;

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((item) => item.tanggal?.startsWith(prefix));
}
