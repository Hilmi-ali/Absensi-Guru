import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, "users", uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        uid,
        ...docSnap.data(),
      };
    }

    return null;
  } catch (error) {
    console.error(error);

    return null;
  }
}
