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
import { Toast } from "@/Components/Toast/Toast"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "@styles/pages/Home.module.scss"
import { updateDocFunc } from "hooks/updateDoc"
import { AuthGuard } from "lib/auth/AuthGuard"
import type { Room } from "types"

const MAX_ROOM_NAME_LENGTH = 10

const Home: NextPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useState<string>("")
  const [addRoomError, setAddRoomError] = useState<boolean>(false)
  const { push } = useRouter()
  const db = getFirestore()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const cancelAction = () => {
    setRoomName("")
    closeModal()
  }

  const addRoom = async () => {
    try {
      if (roomName && roomName.length <= MAX_ROOM_NAME_LENGTH) {
        const docId = await updateDocFunc(
          { title: roomName, updatedAt: serverTimestamp() },
          "rooms",
        )
        if (!docId?.id) {
          throw Error
        }
        push(`/${docId.id}`)
      }
    } catch (e) {
      console.log(e)
      setAddRoomError(true)
    }
  }

  useEffect(() => {
    const docFetch = async () => {
      const roomDocs = await getDocs(
        query(collection(db, "rooms"), limit(20), orderBy("updatedAt", "desc")),
      )
      const data: Room[] = []
      roomDocs.forEach((room) => {
        const roomData = { ...room.data(), id: room.id } as Room
        data.push(roomData)
      })
      setRooms(data)
    }
    docFetch()
  }, [])

  return (
    <AuthGuard>
      <Toast
        text="???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
        isShow={addRoomError}
      />
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
              <Link href={`/${room.id}`} key={index}>
                <li>{`${room.title}?????????`}</li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className={styles.noRoomText}>
            ???????????????????????????????????????????????????????????????????????????????????????????????????
          </p>
        )}
        <button className={styles.add} onClick={openModal} />
      </Layout>
    </AuthGuard>
  )
}

export default Home
