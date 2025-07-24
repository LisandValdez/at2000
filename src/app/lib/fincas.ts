import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllFincas() {
  const fincasRef = collection(db, "fincas");
  const snapshot = await getDocs(fincasRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Elimina una finca por ID
export async function deleteFincaById(id: string) {
  const fincaRef = doc(db, "fincas", id);
  await deleteDoc(fincaRef);
}
