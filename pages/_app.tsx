import type { AppProps } from "next/app"
import "@styles/reset.css"
import "@styles/globals.scss"
import { AuthGuard } from "lib/auth/AuthGuard"
import { AuthProvider } from "lib/auth/AuthProvider"
import { initializeFirebaseApp } from "lib/firebase/firebase"

initializeFirebaseApp()
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      {/* <AuthGuard> */}
      <Component {...pageProps} />
      {/* </AuthGuard> */}
    </AuthProvider>
  )
}

export default MyApp
