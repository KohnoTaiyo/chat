import { addDoc, doc, getFirestore, setDoc, collection, getDoc, getDocs } from "firebase/firestore"

const db = getFirestore()

export const updateDocFunc = async (updateData: Object, type: "users" | "rooms", id?: string) => {
  if (id) {
    await setDoc(doc(db, type, id), updateData)
  } else {
    const docRef = doc(collection(db, type))
    await setDoc(docRef, updateData)
    return docRef
  }
}

export const updateRoomSubDocFunc = async (updateData: Object, roomId: string) => {
  await addDoc(collection(db, "rooms", roomId, "text"), updateData)
}
