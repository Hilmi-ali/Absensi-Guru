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
import { getDeviceInfo } from "./deviceService";

const COLLECTION = "attendance";
const ATTEMPT_COLLECTION = "attendance_attempts";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getAttendanceId(uid) {
  return `${getToday()}_${uid}`;
}

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

function getAttendanceStatus(insideArea, clockStatus) {
  if (!insideArea) {
    return "absen";
  }

  if (clockStatus === "late") {
    return "terlambat";
  }

  return "hadir";
}

export async function saveAttendance(data, settings) {
  try {
    if (!data?.uid) {
      throw new Error("UID guru tidak ditemukan.");
    }

    if (
      data.latitude === null ||
      data.latitude === undefined ||
      data.longitude === null ||
      data.longitude === undefined
    ) {
      throw new Error("GPS_REQUIRED");
    }

    const device = getDeviceInfo();

    const attendanceId = getAttendanceId(data.uid);

    const attendanceRef = doc(db, COLLECTION, attendanceId);

    const existingAttendance = await getDoc(attendanceRef);

    if (existingAttendance.exists()) {
      return {
        success: false,
        status: existingAttendance.data().status,
        alreadyExists: true,
      };
    }

    if (!data.insideArea) {
      await addDoc(collection(db, ATTEMPT_COLLECTION), {
        uid: data.uid,
        nama: data.nama,
        role: data.role,

        tanggal: getToday(),

        jam: new Date().toLocaleTimeString("id-ID"),

        latitude: data.latitude,
        longitude: data.longitude,

        accuracy: data.accuracy,

        distance:
          typeof data.distance === "number"
            ? Number(data.distance.toFixed(2))
            : null,

        insideArea: false,

        status: "absen",

        attempt: true,

        device,

        schoolName: settings.schoolName,
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
        device,
      };
    }

    const status = getAttendanceStatus(data.insideArea, data.clockStatus);

    await setDoc(attendanceRef, {
      uid: data.uid,
      nama: data.nama,
      role: data.role,

      tanggal: getToday(),

      jam: new Date().toLocaleTimeString("id-ID"),

      latitude: data.latitude,
      longitude: data.longitude,

      accuracy: data.accuracy,

      distance:
        typeof data.distance === "number"
          ? Number(data.distance.toFixed(2))
          : null,

      insideArea: true,

      status,

      attempt: false,

      device,

      schoolName: settings.schoolName,
      schoolLatitude: settings.latitude,
      schoolLongitude: settings.longitude,
      schoolRadius: settings.radius,

      openTime: settings.openTime,
      closeTime: settings.closeTime,

      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      status,
      attempt: false,
      device,
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

    const attendanceData = attendanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),

      source: "attendance",
    }));

    const attemptData = attemptSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),

      source: "attendance_attempts",

      status: "absen",
    }));

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
