import { getAuth, signInAnonymously } from "firebase/auth"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Toast } from "@/Components/Toast/Toast"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "@styles/pages/Auth.module.scss"
import { useAuthContext } from "lib/auth/AuthProvider"

const Auth: NextPage = () => {
  const [registrationError, setRegistrationError] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const { user } = useAuthContext()
  const { push } = useRouter()
  const db = getFirestore()

  const handleSubmit = async () => {
    try {
      const auth = getAuth()
      setLoading(true)
      // 匿名ログイン
      await signInAnonymously(auth)
      // // 初期ユーザーデータ登録
      // if (user) {
      //   console.log("bbb")
      //   await setDoc(doc(db, "users", user.uid), {
      //     name: "",
      //     image: "",
      //   })
      // }
      push("/")
    } catch (e) {
      console.log(e)
      setRegistrationError(true)
    }
  }

  useEffect(() => {
    if (user) {
      push("/")
    }
  }, [])

  return (
    <Layout>
      <Toast
        text="予期していないエラーが発生しました。お時間を置いて再度ご登録いただくかお問い合わせください。"
        isShow={registrationError}
      />

      <button className={styles.signButton} onClick={handleSubmit}>
        {isLoading ? "Loading..." : "Sign Up!"}
      </button>
    </Layout>
  )
}

export default Auth
