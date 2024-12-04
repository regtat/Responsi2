import { auth, db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp, getDoc } from "firebase/firestore";

// Interface data
export interface Resep {
  id?: string;
  nama: string;
  langkah: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const firestoreService = {
  getResepRef() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    return collection(db, "users", uid, "reseps");
  },

  async addResep(resep: Omit<Resep, "id">) {
    const resepRef = this.getResepRef();
    const docRef = await addDoc(resepRef, {
      ...resep,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async getReseps(): Promise<Resep[]> {
    const resepRef = this.getResepRef();
    const q = query(resepRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Resep));
  },

  async updateResep(id: string, resep: Partial<Resep>) {
    const resepRef = this.getResepRef();
    const docRef = doc(resepRef, id);
    await updateDoc(docRef, {
      ...resep,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteResep(id: string) {
    const resepRef = this.getResepRef();
    const docRef = doc(resepRef, id);
    await deleteDoc(docRef);
  },

  async getResepById(id: string): Promise<Resep | null> {
    const resepRef = this.getResepRef();
    const docRef = doc(resepRef, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Resep;
    } else {
      return null;
    }
  },
};
