import { useRouter } from "next/router"
import type { ReactNode } from "react"
import { useAuthContext } from "./AuthProvider"

type Props = {
  children: ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext()
  const { push } = useRouter()

  if (typeof user === "undefined") {
    return <>読み込み中...</>
  }

  if (user === null) {
    push("/auth")
    return <></>
  }

  return <>{children}</>
}
