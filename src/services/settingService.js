import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const settingsRef = doc(db, "settings", "attendance");

export function subscribeAttendanceSettings(callback) {
  return onSnapshot(
    settingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    },
    (error) => {
      console.error("Gagal membaca pengaturan:", error);
    },
  );
}

export async function updateAttendanceSettings(data) {
  await updateDoc(settingsRef, data);
}
