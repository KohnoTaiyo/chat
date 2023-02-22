import classNames from "classnames"
import { FC } from "react"
import styles from "./Button.module.scss"

type ButtonProps = {
  type?: "submit"
  disabled?: boolean
  color?: "primary" | "white"
  onClick?: () => void
  text: string
  width?: string
  addClassNames?: string
  isShadow?: boolean
}

const Button: FC<ButtonProps> = (props) => {
  const buttonClass = classNames(styles.button, props.addClassNames, {
    [styles.button__white]: props.color === "white",
    [styles.button__shadow]: props.isShadow,
  })

  return (
    <button
      type={props.type}
      disabled={props.disabled}
      className={buttonClass}
      style={{ width: props.width ? `${props.width}` : "100%" }}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  )
}

export { Button }
