import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useState } from "react"
import { LoginUser, Room } from "types"

const useGetDocById = (type: "users" | "rooms", id?: string) => {
  const [data, setData] = useState<LoginUser | Room>()
  const db = getFirestore()

  const fetch = async () => {
    if (!id) return
    const docRef = doc(db, type, id)
    const docSnap = await getDoc(docRef)
    setData(docSnap.data())
  }
  fetch()

  return { data } as const
}

export { useGetDocById }
