import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  addDoc,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/config";

const COLLECTION = "attendance";
const ATTEMPT_COLLECTION = "attendance_attempts";

// ============================================================
// TANGGAL HARI INI
// Format: YYYY-MM-DD
// ============================================================

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ============================================================
// ID ABSENSI RESMI
// Satu guru maksimal satu dokumen per hari
// ============================================================

export function getAttendanceId(uid) {
  return `${getToday()}_${uid}`;
}

// ============================================================
// CEK ABSENSI RESMI HARI INI
//
// HANYA membaca collection "attendance"
// Tidak membaca "attendance_attempts"
// ============================================================

export async function checkTodayAttendance(uid) {
  try {
    if (!uid) return null;

    const attendanceId = getAttendanceId(uid);

    const ref = doc(db, COLLECTION, attendanceId);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Gagal mengecek absensi:", error);

    return null;
  }
}

// ============================================================
// MENENTUKAN STATUS ABSENSI RESMI
//
// insideArea = true
// clockStatus = open  → hadir
// clockStatus = late  → terlambat
//
// Jika di luar area, fungsi ini tidak digunakan karena
// datanya masuk ke attendance_attempts.
// ============================================================

function getAttendanceStatus(insideArea, clockStatus) {
  if (!insideArea) {
    return "absen";
  }

  if (clockStatus === "late") {
    return "terlambat";
  }

  return "hadir";
}

// ============================================================
// MENYIMPAN ABSENSI
//
// ALUR:
//
// GPS mati
//    ↓
// tidak dicatat
//
// GPS aktif + luar radius
//    ↓
// attendance_attempts
//
// GPS aktif + dalam radius
//    ↓
// attendance
//
// open  → hadir
// late  → terlambat
// ============================================================

export async function saveAttendance(data, settings) {
  try {
    // ========================================================
    // 1. VALIDASI USER
    // ========================================================

    if (!data?.uid) {
      throw new Error("UID guru tidak ditemukan.");
    }

    // ========================================================
    // 2. GPS WAJIB AKTIF
    //
    // Jika koordinat tidak tersedia:
    // TIDAK ADA DATA YANG DISIMPAN
    // ========================================================

    const hasLocation =
      data.latitude !== null &&
      data.latitude !== undefined &&
      data.longitude !== null &&
      data.longitude !== undefined;

    if (!hasLocation) {
      throw new Error("GPS_REQUIRED");
    }

    // ========================================================
    // 3. VALIDASI SETTINGS
    // ========================================================

    if (!settings) {
      throw new Error("SETTINGS_REQUIRED");
    }

    // ========================================================
    // 4. JIKA DI LUAR RADIUS
    //
    // PENTING:
    // Jangan cek attendance utama terlebih dahulu.
    //
    // Karena attempt HARUS tetap bisa dicatat berkali-kali
    // dan tidak boleh menghalangi guru untuk mencoba lagi.
    // ========================================================

    if (!data.insideArea) {
      await addDoc(collection(db, ATTEMPT_COLLECTION), {
        uid: data.uid,
        nama: data.nama || "",
        role: data.role || "guru",

        tanggal: getToday(),

        jam: new Date().toLocaleTimeString("id-ID"),

        latitude: data.latitude,
        longitude: data.longitude,

        accuracy: typeof data.accuracy === "number" ? data.accuracy : null,

        distance:
          typeof data.distance === "number"
            ? Number(data.distance.toFixed(2))
            : null,

        insideArea: false,

        status: "absen",

        attempt: true,

        // Simpan status waktu saat attempt
        clockStatus: data.clockStatus || null,

        schoolName: settings.schoolName || "",
        schoolLatitude: settings.latitude,
        schoolLongitude: settings.longitude,
        schoolRadius: settings.radius,

        openTime: settings.openTime,
        closeTime: settings.closeTime,

        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        status: "absen",
        attempt: true,
      };
    }

    // ========================================================
    // 5. JIKA DI DALAM RADIUS
    //
    // SEKARANG baru cek apakah guru sudah memiliki
    // absensi resmi hari ini.
    // ========================================================

    const attendanceId = getAttendanceId(data.uid);

    const attendanceRef = doc(db, COLLECTION, attendanceId);

    const existingAttendance = await getDoc(attendanceRef);

    // ========================================================
    // 6. SUDAH HADIR / TERLAMBAT
    //
    // Tidak boleh membuat absensi kedua.
    // ========================================================

    if (existingAttendance.exists()) {
      const existingData = existingAttendance.data();

      return {
        success: false,
        status: existingData.status,
        alreadyExists: true,
      };
    }

    // ========================================================
    // 7. TENTUKAN STATUS ABSENSI RESMI
    // ========================================================

    const status = getAttendanceStatus(data.insideArea, data.clockStatus);

    // ========================================================
    // 8. SIMPAN ABSENSI RESMI
    // ========================================================

    await setDoc(attendanceRef, {
      uid: data.uid,
      nama: data.nama || "",
      role: data.role || "guru",

      tanggal: getToday(),

      jam: new Date().toLocaleTimeString("id-ID"),

      latitude: data.latitude,
      longitude: data.longitude,

      accuracy: typeof data.accuracy === "number" ? data.accuracy : null,

      distance:
        typeof data.distance === "number"
          ? Number(data.distance.toFixed(2))
          : null,

      insideArea: true,

      status,

      attempt: false,

      clockStatus: data.clockStatus || null,

      schoolName: settings.schoolName || "",
      schoolLatitude: settings.latitude,
      schoolLongitude: settings.longitude,
      schoolRadius: settings.radius,

      openTime: settings.openTime,
      closeTime: settings.closeTime,

      createdAt: serverTimestamp(),
    });

    // ========================================================
    // 9. HASIL
    // ========================================================

    return {
      success: true,
      status,
      attempt: false,
    };
  } catch (error) {
    console.error("Gagal menyimpan absensi:", error);

    return {
      success: false,
      status: null,
      error: error.message,
    };
  }
}

// ============================================================
// ADMIN
//
// Mengambil:
// attendance
// +
// attendance_attempts
//
// Guru tidak menggunakan fungsi ini.
// Guru menggunakan historyService.js yang hanya mengambil
// status hadir + terlambat.
// ============================================================

export async function getAttendanceHistory() {
  try {
    const attendanceQuery = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc"),
    );

    const attemptQuery = query(
      collection(db, ATTEMPT_COLLECTION),
      orderBy("createdAt", "desc"),
    );

    const [attendanceSnapshot, attemptSnapshot] = await Promise.all([
      getDocs(attendanceQuery),
      getDocs(attemptQuery),
    ]);

    // ========================================================
    // ABSENSI RESMI
    // ========================================================

    const attendanceData = attendanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      source: "attendance",
    }));

    // ========================================================
    // ATTEMPT / LUAR RADIUS
    // ========================================================

    const attemptData = attemptSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),

      source: "attendance_attempts",

      status: "absen",
    }));

    // ========================================================
    // GABUNGKAN
    // ========================================================

    return [...attendanceData, ...attemptData].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;

      return timeB - timeA;
    });
  } catch (error) {
    console.error("Gagal mengambil riwayat absensi:", error);

    return [];
  }
}

// ============================================================
// REKAP BULANAN
//
// Hanya mengambil ABSENSI RESMI.
//
// attendance_attempts tidak dihitung sebagai kehadiran.
// ============================================================

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
