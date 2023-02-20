import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import styles from "./Header.module.scss"

const Header: FC = () => (
  <header className={styles.header}>
    <Link href="/">
      <p className={styles.header__logo}>G Chat!</p>
    </Link>
    <Image src="/member.svg" alt="" width={40} height={40} />
  </header>
)

export { Header }
