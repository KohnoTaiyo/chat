import type { AppProps } from "next/app"
import "@styles/reset.css"
import "@styles/globals.scss"
import { AuthProvider } from "lib/auth/AuthProvider"
import { initializeFirebaseApp } from "lib/firebase/firebase"

initializeFirebaseApp()
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
