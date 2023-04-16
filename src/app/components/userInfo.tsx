import { Dispatch, SetStateAction, useState } from "react"
import { Alert, Button, Modal } from "react-bootstrap"
import { deleteTask } from "../handlers/task";

import "../sass/crud.scss"

export enum Outcome {
  Success,
  Error
}

type OutcomeType = {
  result: string;
  message: string;
}

type OutcomeProps = {
    message: string;
    showMessage: boolean;
    setShowMessage: Dispatch<SetStateAction<boolean>>;
}

interface OutcomeTypeProps extends OutcomeProps {
  outcomeString: string;
}

interface ConfirmProps extends CrudConfirmProps {
  operationMethod: () => Promise<Response>;
  confirmOperationNoun: string;
  confirmOperationVerb: string;

}
export type CrudConfirmProps = {
  taskIdentifier: number;
  taskTitle: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const SuccessModal = (props: OutcomeProps) => {
  const successProps: OutcomeTypeProps = {
    ...props,
    outcomeString: "Success!"
  }
  return <OutcomeModal {...successProps}/>
}

export const ErrorModal = (props: OutcomeProps) => {
  const errorProps: OutcomeTypeProps = {
    ...props,
    outcomeString: "Error!"
  }
  return <OutcomeModal {...errorProps}/>
}

export const OutcomeModal = (props: OutcomeTypeProps) => {
  const { message, showMessage, setShowMessage, outcomeString } = props
  
    return (
      <Alert show={showMessage} className={outcomeString == "Success!" ? "alert alert-success" : "alert alert-danger"} dismissible>
        {outcomeString} {message}
      </Alert>
    )
}

export const ConfirmDeleteModal = (props: CrudConfirmProps) => {
  const confirmProps: ConfirmProps = {
    ...props,
    operationMethod: async () => await deleteTask(props.taskIdentifier),
    confirmOperationNoun: "deletion",
    confirmOperationVerb: "delete"
  }

  return <ConfirmModal {...confirmProps}  />
}

const ConfirmModal = (props: ConfirmProps) => {
  const [outcome, setOutcome] = useState<OutcomeType>();
  const [showOutcome, setShowOutcome] = useState<boolean>(false);
  
  const crudOperation = async () => {
    try {
      await props.operationMethod()
      setOutcome({
        result: 'Success!', 
        message: `Task ${props.taskIdentifier} titled ${props.taskTitle} was ${props.confirmOperationVerb}d.`
      })
    } catch (err: any) {
      console.log(err);
      const message = err.message;
      if (err instanceof Error) {
        setOutcome({
          result: 'Error',
          message: err.message
        });
      } else if (typeof err === "string") {
        setOutcome({
          result: 'Error',
          message: err
        });
      }
    } finally {
      setShowOutcome(true);
    }

  }
  return (
    <>
      <Modal show={props.showModal} onHide={() => props.setShowModal(prev => false)} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {props.confirmOperationNoun} of Task {props.taskIdentifier}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will {props.confirmOperationVerb} task id {props.taskIdentifier} titled: 
          <p className="task-title-confirm">{props.taskTitle}</p> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShowModal(prev => false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => crudOperation()}>Confirm</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOutcome} onHide={() => setShowOutcome(prev => false)} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{outcome?.result}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {outcome?.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowOutcome(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
  </>
  )
}