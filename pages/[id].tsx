import { serverTimestamp } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Button } from "@/Components/Button/Button"
import { Dialog } from "@/Components/Dialog/Dialog"
import { InputText } from "@/Components/InputText/InputText"
import { Toast } from "@/Components/Toast/Toast"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "@styles/pages/Chat.module.scss"
import { getDocById, getTextsHistory, getTextsRealTime } from "hooks/getDocById"
import { updateDocFunc, updateRoomSubDocFunc } from "hooks/updateDoc"
import { AuthGuard } from "lib/auth/AuthGuard"
import { useAuthContext } from "lib/auth/AuthProvider"
import type { LoginUser, Room, Text } from "types"

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
  const [texts, setTexts] = useState<Text[] | undefined>()
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false)
  const [registrationError, setRegistrationError] = useState<boolean>(false)
  const [fileValidation, setFileValidation] = useState<boolean>(false)
  const scrollElement = useRef<HTMLUListElement>(null)

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
        }, 2000)
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
    if (userData && props.data.id && user?.uid) {
      updateRoomSubDocFunc(
        {
          text: message,
          name: userData.name,
          image: userData.image,
          createdAt: serverTimestamp(),
          userId: user.uid,
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

  // const [a, aa] = useState<any>()
  // console.log(a)
  useEffect(() => {
    const fetch = async () => {
      if (!props.data.id) return
      const historyText = (await getTextsHistory(props.data.id)) as Text[] | undefined
      setTexts(historyText)
    }
    fetch()
    scrollElement.current?.scrollTo(5000, 5000)
    // const g = getTextsRealTime(props.data.id)
    // aa(g)
  }, [])

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
        {texts && (
          <ul className={styles.message} ref={scrollElement}>
            {texts.map((text, index) =>
              text.userId === user?.uid ? (
                <div className={styles.message__item} data-left key={index}>
                  <li>{text.text}</li>
                </div>
              ) : (
                <li className={styles.message__item} key={index}>
                  <div className={styles.message__itemImage}>
                    <Image src={text.image} alt="" fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className={styles.message__itemContents}>
                    <p className={styles.message__itemName}>{text.name}</p>
                    <p className={styles.message__itemText}>{text.text}</p>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
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
