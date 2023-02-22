import { getAuth, signOut } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useState, useRef, useEffect } from "react"
import styles from "./Header.module.scss"
import { Toast } from "@/Components/Toast/Toast"
import { getDocById } from "hooks/getDocById"
import { useAuthContext } from "lib/auth/AuthProvider"
import { LoginUser } from "types"

type HeaderProps = {
  historyBack?: boolean
  title?: string
  reImageFetch?: boolean
}

const Header: FC<HeaderProps> = (props) => {
  const { user } = useAuthContext()
  const [userData, setUserData] = useState<LoginUser>()
  const [signOutError, setSignOutError] = useState<boolean>(false)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const handleClick = () => setModalOpen(!isModalOpen)
  const { back } = useRouter()

  const signOutHandler = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      setModalOpen(false)
    } catch (e) {
      console.log(e)
      setSignOutError(true)
    }
  }

  // モーダル外をクリックしたらモーダルを閉じる
  const logoRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const logoElement = logoRef.current
    if (!logoElement) return
    const closeModal = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !logoElement.contains(e.target) &&
        !modalRef.current?.contains(e.target)
      ) {
        setModalOpen(false)
      }
    }

    document.addEventListener("click", closeModal)
    return () => document.removeEventListener("click", closeModal)
  }, [])

  useEffect(() => {
    if (!user?.uid) return
    const fetch = async () => {
      const data = await getDocById("users", user.uid)
      setUserData(data as LoginUser)
    }
    fetch()
  }, [props.reImageFetch, user?.uid])

  return (
    <>
      <Toast
        text="予期していないエラーが発生しました。お時間を置いて再度実行していただくかお問い合わせください。"
        isShow={signOutError}
      />

      <header className={styles.header}>
        {props.historyBack ? (
          <p className={styles.header__logo} onClick={() => back()}>
            <span className={styles.header__logoArrow}>＜</span>
          </p>
        ) : (
          <Link href="/">
            <p className={styles.header__logo}>G Chat!</p>
          </Link>
        )}
        {props.title && <p className={styles.header__title}>{props.title}</p>}
        <div className={styles.header__info}>
          <div onClick={handleClick} ref={logoRef} className={styles.header__infoImage}>
            <Image
              src={userData?.image || "/member.svg"}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {isModalOpen && (
            <div className={styles.header__infoModal} ref={modalRef}>
              {user ? <p onClick={signOutHandler}>Sign out</p> : <p>Hello!</p>}
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export { Header }
