import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getAttendanceHistory(uid) {
  const q = query(
    collection(db, "attendance"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
