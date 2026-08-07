import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

export async function getDashboardStats(today) {
  const guruSnapshot = await getDocs(collection(db, "users"));

  const attendanceSnapshot = await getDocs(
    query(collection(db, "attendance"), where("tanggal", "==", today)),
  );

  const teachers = guruSnapshot.docs.filter(
    (doc) => doc.data().role === "guru",
  );

  const attendance = attendanceSnapshot.docs.map((doc) => doc.data());

  const hadir = attendance.filter((item) => item.status === "hadir");

  const curang = attendance.filter((item) => item.status === "ditolak");

  return {
    totalGuru: teachers.length,
    hadir: hadir.length,
    belumHadir: teachers.length - hadir.length,
    curang: curang.length,
    attendance,
  };
}
