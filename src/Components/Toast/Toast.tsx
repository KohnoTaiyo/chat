import classnames from "classnames"
import { FC } from "react"
import styles from "./Toast.module.scss"

type ToastProps = {
  text: string
  isShow?: boolean
  color?: "red" | "green"
}

const Toast: FC<ToastProps> = (props) => {
  const toastClass = classnames(styles.toast, {
    [styles.toast__green]: props.color === "green",
  })

  return (
    <div className={toastClass} data-show={props.isShow || undefined}>
      {props.text}
    </div>
  )
}

export { Toast }
