import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../firebase/config";

export async function getAttendanceHistory(uid) {
  if (!uid) {
    return [];
  }

  const q = query(collection(db, "attendance"), where("uid", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((item) => item.status === "hadir" || item.status === "terlambat")
    .sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;

      return timeB - timeA;
    });
}
