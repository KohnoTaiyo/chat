import Head from "next/head"
import { FC, ReactNode } from "react"

type LayoutProps = {
  title?: string
  description?: string
  children: ReactNode
}

const Layout: FC<LayoutProps> = (props) => (
  <>
    <Head>
      <title>{props.title || "チャットWebアプリ"}</title>
      <meta name="description" content={props.description || "課題のチャットWebアプリです"} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {props.children}
  </>
)

export { Layout }
