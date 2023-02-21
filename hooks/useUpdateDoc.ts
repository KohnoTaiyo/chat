import { doc, getFirestore, setDoc } from "firebase/firestore"

const updateDocFunc = async (updateData: Object, type: "users" | "rooms", id?: string) => {
  const db = getFirestore()
  if (!id) return
  await setDoc(doc(db, type, id), updateData)
}

export { updateDocFunc }
