import { getFirestore, doc, getDoc } from "firebase/firestore"

const db = getFirestore()

const getDocById = async (type: "users" | "rooms", id: string) => {
  try {
    const docRef = doc(db, type, id)
    const docSnap = await getDoc(docRef)
    const data = docSnap.data()
    return data
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export { getDocById }
