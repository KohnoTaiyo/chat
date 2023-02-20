import styles from "@styles/pages/Auth.module.scss"
import { getAuth, signInAnonymously } from "firebase/auth"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Toast } from "@/Components/Toast/Toast"
import { Layout } from "@/Templates/Layout/Layout"
import { useAuthContext } from "lib/auth/AuthProvider"

type UserInput = {
  name: string
}

const Home: NextPage = () => {
  const [registrationError, setRegistrationError] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const { user } = useAuthContext()
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>()

  const onSubmit: SubmitHandler<UserInput> = async (data) => {
    try {
      const auth = getAuth()
      setLoading(true)
      await signInAnonymously(auth)
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

      <dialog open className={styles.dialog}>
        <p className={styles.dialog__title}>Sign up?</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.name?.message && <p className={styles.dialog__error}>{errors.name.message}</p>}
          <input
            type="text"
            placeholder="Your name"
            className={styles.dialog__name}
            {...register("name", {
              required: "必須項目です。",
              maxLength: { value: 20, message: "20文字以内で入力してください。" },
            })}
            data-error={errors.name?.message}
          />
          <button type="submit" className={styles.dialog__submit}>
            {isLoading ? "Loading..." : "Sign up!"}
          </button>
        </form>
        {/* <input type="file" /> */}
      </dialog>
    </Layout>
  )
}

export default Home
