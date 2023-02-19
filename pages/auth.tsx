import type { NextPage } from "next"
import { Layout } from "@/Templates/Layout/Layout"
import styles from "styles/pages//Auth.module.scss"

const Home: NextPage = () => (
  <Layout>
    <dialog open className={styles.dialog}>
      test
    </dialog>
  </Layout>
)

export default Home
