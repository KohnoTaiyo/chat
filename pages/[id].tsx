import type { GetServerSideProps, NextPage } from "next"
import { FormEvent, useRef, useState } from "react"
import { Dialog } from "@/Components/Dialog/Dialog"
import { InputText } from "@/Components/InputText/InputText"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "@styles/pages/Chat.module.scss"
import { useGetDocById } from "hooks/useGetDocById"
import { updateDocFunc } from "hooks/useUpdateDoc"
import { AuthGuard } from "lib/auth/AuthGuard"
import { useAuthContext } from "lib/auth/AuthProvider"
import type { LoginUser } from "types"

type PageProps = {
  title: string
}

type PathParams = {
  id: string
}

const MAX_ROOM_NAME_LENGTH = 10

const Chat: NextPage<PageProps> = (props) => {
  const { user } = useAuthContext()
  const [userData, setUserData] = useState<LoginUser | undefined>()
  const [userName, setUserName] = useState<string>("")

  const dialogRef = useRef<HTMLDialogElement>(null)
  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const cancelAction = () => {
    setUserName("")
    closeModal()
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    userData ? sendMessage() : openModal()
  }

  const userInfoRegister = async () => {
    if (userName && userName.length <= MAX_ROOM_NAME_LENGTH) {
      updateDocFunc({ name: userName, image: "tehjs" }, "users", user?.uid)
      closeModal()
    }
  }

  const sendMessage = () => {
    console.log("sendMessage")
  }

  const { data } = useGetDocById("users", user?.uid)
  if (data) {
    setUserData(data as LoginUser)
  }

  return (
    <AuthGuard>
      <Dialog ref={dialogRef} cancelFunc={cancelAction} doFunc={userInfoRegister}>
        <p className={styles.dialog__message}>
          メッセージを送信するには
          <br />
          情報の登録が必要です。
        </p>
        <InputText
          value={userName}
          onChage={setUserName}
          placeholder="Your name"
          maxLength={10}
          require
        />
      </Dialog>
      <Layout historyBack pageTitle={props.title}>
        <form className={styles.send} onSubmit={onSubmit}>
          <input type="text" placeholder="Type a message here" />
          <button type="submit">Send!</button>
        </form>
      </Layout>
    </AuthGuard>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { id } = context.params as PathParams
  return { props: { title: id } }
}

export default Chat
