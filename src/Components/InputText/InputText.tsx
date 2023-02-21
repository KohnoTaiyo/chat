import { ChangeEvent, FC, useState } from "react"
import styles from "./InputText.module.scss"

type InputTextProps = {
  value: string
  onChage: (value: string) => void
  placeholder: string
  maxLength?: number
  require?: boolean
}

const InputText: FC<InputTextProps> = (props) => {
  const [errorLength, setErrorRength] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_ROOM_NAME_LENGTH = props.maxLength
    MAX_ROOM_NAME_LENGTH && props.value.length >= MAX_ROOM_NAME_LENGTH
      ? setErrorRength(true)
      : setErrorRength(false)
    props.onChage(e.target.value)
  }

  return (
    <>
      {(errorLength || props.require) && (
        <p className={styles.error}>{errorLength ? "*10文字以内で入力" : "*必須項目"}</p>
      )}
      <input
        type="text"
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        className={styles.input}
      />
    </>
  )
}

export { InputText }
