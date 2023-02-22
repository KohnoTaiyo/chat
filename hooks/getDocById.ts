import {
  getFirestore,
  doc,
  getDoc,
  collection,
  onSnapshot,
  limit,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore"
import { Text } from "types"

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

const getTextsHistory = async (roomId: string) => {
  try {
    const historyData = await getDocs(
      query(collection(db, "rooms", roomId, "text"), limit(50), orderBy("createdAt", "asc")),
    )
    const data = historyData.docs.map((doc) => doc.data())
    return data
  } catch (e) {
    console.log(e)
    return undefined
  }
}

const getTextsRealTime = async (roomId: string) => {
  const texts: Text[] = []
  try {
    const textColRef = collection(db, "rooms", roomId, "text")

    const q = query(textColRef, limit(50), orderBy("createdAt", "desc"))
    onSnapshot(q, (snapshot) => {
      // snapshot.docs.forEach((doc) => {
      //   texts.push({
      //     ...doc.data(),
      //     name: doc.data().name,
      //   } as Text)
      // })
      // snapshot.docs.forEach((d) => console.log(d.data()))
    })
    return texts
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export { getDocById, getTextsHistory, getTextsRealTime }
