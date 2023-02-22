import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { GetServerSideProps, NextPage } from "next"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Button } from "@/Components/Button/Button"
import { Dialog } from "@/Components/Dialog/Dialog"
import { InputText } from "@/Components/InputText/InputText"
import { Toast } from "@/Components/Toast/Toast"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "@styles/pages/Chat.module.scss"
import { getDocById } from "hooks/useGetDocById"
import { updateDocFunc, updateRoomSubDocFunc } from "hooks/useUpdateDoc"
import { AuthGuard } from "lib/auth/AuthGuard"
import { useAuthContext } from "lib/auth/AuthProvider"
import type { LoginUser, Room } from "types"

type PageProps = {
  data: Room
}
type PathParams = {
  id: string
}

const MAX_ROOM_NAME_LENGTH = 10

const Chat: NextPage<PageProps> = (props) => {
  const { user } = useAuthContext()
  const [userData, setUserData] = useState<LoginUser | undefined>()
  const [userName, setUserName] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [userImage, setUserImage] = useState<File>()
  const [dialogDoText, setDialogDoText] = useState<string>("OK")
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false)
  const [registrationError, setRegistrationError] = useState<boolean>(false)
  const [fileValidation, setFileValidation] = useState<boolean>(false)

  const dialogRef = useRef<HTMLDialogElement>(null)
  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const cancelAction = () => {
    setUserName("")
    closeModal()
  }

  const userInfoRegister = () => {
    if (userImage && userName && userName.length <= MAX_ROOM_NAME_LENGTH) {
      try {
        const storage = getStorage()
        const imageRef = ref(storage, user?.uid)
        uploadBytes(imageRef, userImage).then(() => {
          getDownloadURL(imageRef).then((url) => {
            updateDocFunc({ name: userName, image: url }, "users", user?.uid)
          })
        })
        setDialogDoText("Loading...")

        // 登録完了を待って発火
        setTimeout(() => {
          setRegistrationSuccess(true)
          closeModal()
        }, 1000)
      } catch (e) {
        console.log(e)
        setRegistrationError(true)
      }
    }
  }

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    const allowedFile = ["image/jpeg", "image/jpg", "image/png"]
    if (file.size > 3000000 || !allowedFile.includes(file.type)) {
      setFileValidation(true)
      e.currentTarget.value = ""
      return
    }
    setUserImage(file)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userData && props.data.id) {
      updateRoomSubDocFunc(
        {
          text: message,
          name: userData.name,
          image: userData.image,
        },
        props.data.id,
      )
    } else {
      openModal()
    }
  }

  useEffect(() => {
    if (!user?.uid) return
    const fetch = async () => {
      const data = await getDocById("users", user.uid)
      setUserData(data as LoginUser)
    }
    fetch()
  }, [registrationSuccess, user?.uid])

  return (
    <AuthGuard>
      <Toast
        text="予期していないエラーが発生しました。お時間を置いて再度ご登録いただくかお問い合わせください。"
        isShow={registrationError}
      />
      <Toast
        text="ファイルサイズが3MBを越えている、または拡張子が指定外のファイルです。"
        isShow={fileValidation}
      />
      <Dialog
        ref={dialogRef}
        cancelFunc={cancelAction}
        doFunc={userInfoRegister}
        doButtonText={dialogDoText}
      >
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
        <p className={styles.dialog__caution}>*3MB以内png,jpeg,jpgのみ</p>
        <label className={styles.dialog__file}>
          {userImage?.name || "アイコン画像を選択"}
          <input type="file" accept="image/png, image/jpeg" onChange={uploadFile} />
        </label>
      </Dialog>
      <Layout historyBack pageTitle={props.data.title} reImageFetch={registrationSuccess}>
        <form className={styles.send} onSubmit={onSubmit}>
          <InputText
            addClassNames={styles.send__input}
            value={message}
            placeholder="Type a message here"
            onChage={setMessage}
          />
          <Button
            type="submit"
            disabled={!message}
            text="Send!"
            isShadow
            width="10%"
            addClassNames={styles.send__button}
          />
        </form>
      </Layout>
    </AuthGuard>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { id } = context.params as PathParams
  const tempData = await getDocById("rooms", id)
  const data = JSON.parse(JSON.stringify({ ...tempData, id }))
  return { props: { data } }
}

export default Chat
