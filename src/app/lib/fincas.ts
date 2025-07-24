import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllFincas() {
  const fincasRef = collection(db, "fincas");
  const snapshot = await getDocs(fincasRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
