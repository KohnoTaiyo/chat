import Head from "next/head"
import { FC, ReactNode } from "react"
import { Header } from "@/Templates/Header/Header"

type LayoutProps = {
  tabTitle?: string
  description?: string
  children: ReactNode
  addClassNames?: string
  historyBack?: boolean
  pageTitle?: string
  reImageFetch?: boolean
}

const Layout: FC<LayoutProps> = (props) => (
  <div className={props.addClassNames}>
    <Head>
      <title>{props.tabTitle || "チャットWebアプリ"}</title>
      <meta name="description" content={props.description || "課題のチャットWebアプリです"} />
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Header
      historyBack={props.historyBack}
      title={props.pageTitle}
      reImageFetch={props.reImageFetch}
    />
    {props.children}
  </div>
)

export { Layout }
