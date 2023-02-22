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
    return (
      <p
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
          fontSize: "3.2rem",
        }}
      >
        読み込み中...
      </p>
    )
  }

  if (user === null) {
    push("/auth")
    return <></>
  }

  return <>{children}</>
}
