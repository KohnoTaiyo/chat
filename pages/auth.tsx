import type { NextPage } from "next"
import { useForm, SubmitHandler } from "react-hook-form"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "styles/pages//Auth.module.scss"

type UserInput = {
  name: string
}

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>()
  const onSubmit: SubmitHandler<UserInput> = (data) => console.log(data)

  return (
    <Layout>
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
            Sign up!
          </button>
        </form>
        {/* <input type="file" /> */}
      </dialog>
    </Layout>
  )
}

export default Home
