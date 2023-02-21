import {
  collection,
  getDocs,
  getFirestore,
  query,
  limit,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { Dialog } from "@/Components/Dialog/Dialog"
import { InputText } from "@/Components/InputText/InputText"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "@styles/pages/Home.module.scss"
import { updateDocFunc } from "hooks/useUpdateDoc"
import { AuthGuard } from "lib/auth/AuthGuard"
import type { Room } from "types"

const MAX_ROOM_NAME_LENGTH = 10

const Home: NextPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useState<string>("")
  const { push } = useRouter()
  const db = getFirestore()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const cancelAction = () => {
    setRoomName("")
    closeModal()
  }

  const addRoom = () => {
    if (roomName && roomName.length <= MAX_ROOM_NAME_LENGTH) {
      updateDocFunc({ title: roomName, updatedAt: serverTimestamp() }, "rooms", roomName)
      push(`/${roomName}`)
    }
  }

  useEffect(() => {
    const docFetch = async () => {
      const roomDocs = await getDocs(
        query(collection(db, "rooms"), limit(20), orderBy("updatedAt", "desc")),
      )
      const data: Room[] = []
      roomDocs.forEach((room) => {
        data.push(room.data() as Room)
      })
      setRooms(data)
    }
    docFetch()
  }, [])

  return (
    <AuthGuard>
      <Layout>
        <Dialog ref={dialogRef} doFunc={addRoom} cancelFunc={cancelAction}>
          <InputText
            value={roomName}
            onChage={setRoomName}
            placeholder="New room name"
            maxLength={10}
            require
          />
        </Dialog>
        {!!rooms.length ? (
          <ul className={styles.room}>
            {rooms.map((room, index) => (
              <Link href={`/${room.title}`} key={index}>
                <li>{`${room.title}の部屋`}</li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className={styles.noRoomText}>
            部屋がありません。右下のボタンから新しい部屋の作成をお願いします！
          </p>
        )}
        <button className={styles.add} onClick={openModal} />
      </Layout>
    </AuthGuard>
  )
}

export default Home
