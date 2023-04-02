import { Dispatch, SetStateAction } from "react"
import { Modal } from "react-bootstrap"

type ErrorProps = {
    // statusCode: number,
    errorMessage: string,
    showMessage: boolean,
    setShowMessage: Dispatch<SetStateAction<boolean>>
}

export const ErrorModal = (props: ErrorProps) => {
  const { errorMessage, showMessage, setShowMessage } = props
    return (
      <div>
        ErrorMessage: { errorMessage }
      </div>
    )
}