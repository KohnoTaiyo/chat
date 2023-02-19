import Head from "next/head"
import { FC, ReactNode } from "react"

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
    {props.children}
  </div>
)

export { Layout }
