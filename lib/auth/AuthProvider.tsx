import type { User } from "@firebase/auth"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

export type GlobalAuthState = {
  user: User | null | undefined
}
type Props = { children: ReactNode }

const initialState: GlobalAuthState = {
  user: undefined,
}

const AuthContext = createContext<GlobalAuthState>(initialState)

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<GlobalAuthState>(initialState)

  useEffect(() => {
    try {
      const auth = getAuth()
      onAuthStateChanged(auth, async (user) => {
        setUser({ user })
      })
    } catch (error) {
      setUser(initialState)
      throw error
    }
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
