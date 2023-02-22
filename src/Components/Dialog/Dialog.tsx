import { forwardRef, ReactNode } from "react"
import styles from "./Dialog.module.scss"
import { Button } from "@/Components/Button/Button"

type DialogProps = {
  children: ReactNode
  cancelFunc: () => void
  doFunc: () => void
  doButtonText?: string
}

/**
 * 基本的に下記のような形で使用する
 * const dialogRef = useRef<HTMLDialogElement>(null)
 * const openModal = () => dialogRef.current?.showModal()
 * const closeModal = () => dialogRef.current?.close()
 */
const Dialog = forwardRef<HTMLDialogElement, DialogProps>((props, ref) => (
  <dialog ref={ref} className={styles.dialog}>
    {props.children}
    <div className={styles.dialog__action}>
      <Button text="CANCEL" onClick={props.cancelFunc} width="10rem" color="white" />
      <Button
        text={props.doButtonText || "OK"}
        onClick={props.doFunc}
        width="10rem"
        color="white"
      />
    </div>
  </dialog>
))

// eslintのエラー避け
Dialog.displayName = "Dialog"

export { Dialog }
