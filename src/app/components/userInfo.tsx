import { Dispatch, SetStateAction } from "react"
import { Button, Modal } from "react-bootstrap"
import { deleteTask } from "../handlers/task";

type ErrorProps = {
    // statusCode: number,
    errorMessage: string;
    showMessage: boolean;
    setShowMessage: Dispatch<SetStateAction<boolean>>;
}

interface ConfirmProps extends CrudConfirmProps {
  operationMethod: Promise<void>;
}
export type CrudConfirmProps = {
  confirmOperation: string;
  taskIdentifier: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const ErrorModal = (props: ErrorProps) => {
  const { errorMessage, showMessage, setShowMessage } = props
    return (
      <div>
        ErrorMessage: { errorMessage }
      </div>
    )
}

export const ConfirmDeleteModal = (props: CrudConfirmProps) => {


  const handleDelete = async () => {
    // return confirm
    await deleteTask(props.taskIdentifier);
  };

  const confirmProps: ConfirmProps = {
    ...props,
    operationMethod: handleDelete()
  }

  return <ConfirmModal {...confirmProps}  />
}

const ConfirmModal = (props: ConfirmProps) => {
  return (
    <Modal show={props.showModal} onHide={() => props.setShowModal(prev => false)} backdrop='static' keyboard={false}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm {props.confirmOperation} of {props.taskIdentifier}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      This will {props.confirmOperation} {props.taskIdentifier}.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.setShowModal(prev => false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => props.operationMethod}>Confirm</Button>
    </Modal.Footer>
</Modal>
  )
}