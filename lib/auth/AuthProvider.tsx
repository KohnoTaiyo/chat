import type { User } from "@firebase/auth"
import { getAuth, onAuthStateChanged } from "@firebase/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type GlobalAuthState = {
  user: User | null | undefined
}
const initialState: GlobalAuthState = {
  user: undefined,
}

const AuthContext = createContext<GlobalAuthState>(initialState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GlobalAuthState>(initialState)

  useEffect(() => {
    try {
      const auth = getAuth()
      onAuthStateChanged(auth, async (user) => {
        setUser({ user })
      })
    } catch (e) {
      setUser(initialState)
      console.log(e)
    }
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
