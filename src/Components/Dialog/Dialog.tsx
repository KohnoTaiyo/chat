import { forwardRef, ReactNode } from "react"
import styles from "./Dialog.module.scss"

type DialogProps = {
  children: ReactNode
  cancelFunc: () => void
  doFunc: () => void
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
      <button onClick={props.cancelFunc}>CANCEL</button>
      <button onClick={props.doFunc}>OK</button>
    </div>
  </dialog>
))

// eslintのエラー避け
Dialog.displayName = "Dialog"

export { Dialog }
