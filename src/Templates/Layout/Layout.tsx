import Head from "next/head"
import { FC, ReactNode } from "react"
import { Header } from "@/Templates/Header/Header"

type LayoutProps = {
  title?: string
  description?: string
  children: ReactNode
  addClassNames?: string
}

const Layout: FC<LayoutProps> = (props) => (
  <div className={props.addClassNames}>
    <Head>
      <title>{props.title || "チャットWebアプリ"}</title>
      <meta name="description" content={props.description || "課題のチャットWebアプリです"} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    {props.children}
  </div>
)

export { Layout }
