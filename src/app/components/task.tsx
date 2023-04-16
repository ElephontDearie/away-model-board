import { Dispatch, SetStateAction, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateEditableFields } from '../handlers/task';
import { Form } from 'react-bootstrap';
import { ConfirmDeleteModal, CrudConfirmProps } from './userInfo';
import { Task } from '@prisma/client';


export enum TaskStatus {
    'To Do',
    'Blocked', 
    'In Progress', 
    'In Code Review', 
    'In Peer Review', 
    'Deployed', 
    'Done'
}

export type InputTask = {
    id: number
    title: string
    description: string
    status: string
}


type taskOptions = {
    peerTeam: boolean,
    task: Task,
    setDraggedIssue: Dispatch<SetStateAction<Task | null>>,
    isAdmin: boolean
}

export const TaskItem = (props: taskOptions): JSX.Element => {
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const {task, isAdmin} = props;

    const confirmDeleteProps: CrudConfirmProps = {
        taskIdentifier: task.id,
        taskTitle: task.title,
        showModal: showDeleteModal,
        setShowModal: setShowDeleteModal,
    }

    const handleDragStart = (event: any, task: SetStateAction<null | Task>) => {
        task && props.setDraggedIssue(task);
    };


    return (
        <div className={"card col border border-black my-3 " + getTaskColour(task)}
            draggable
            onDragStart={event => handleDragStart(event, task)}
        >
            <h6 className="card-title text-dark">#{task.id}</h6>
            <h5 className="card-title bg-dark text-center">{task.title}</h5>
            <h6 className="card-subtitle text-dark">{task.description}</h6>
            
            <section>
                <Button className='btn btn-outline-dark text-white' onClick={() => setShowEditModal(true)}>Edit</Button>
                {!!isAdmin && <Button className='btn btn-danger btn-outline-dark text-white' onClick={() => setShowDeleteModal(true)}>Delete</Button>}
                <ConfirmDeleteModal {...confirmDeleteProps}/>
            </section>
            <EditModal task={task} showModal={showEditModal} setShowModal={setShowEditModal}/>
        </div>

    )
}


export type Editable  = {
    title: string;
    description: string;
}
const editableFields = (task: InputTask): Editable => ({
    title: task.title,
    description: task.description,
})

// TODO: Add taskId, sprint titles of sprints the task has been in, author, created date, and updated date.
type Displayable = {
    status: string;
}

// TODO: Add taskId, sprint titles of sprints the task has been in, author, created date, and updated date.
const readableFields = (task: InputTask): Displayable => ({
    status: task.status.toString(),
})

type EditProps = {
    task: InputTask; 
    showModal: boolean; 
    setShowModal: Dispatch<SetStateAction<boolean>>;
}
export const EditModal = (props: EditProps): JSX.Element => {
    const { task, showModal, setShowModal } = props;
    const fields: Editable = editableFields(task);
    const readOnlyFields: Displayable = readableFields(task)
    const [updatedFields, setUpdatedFields] = useState<Editable>(fields);


    const updateTaskFields = (id: number, updatedFields: Editable) => {
        updateEditableFields(id, updatedFields);
        setShowModal(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (field == 'title') {
            updatedFields.title = e.target.value;
        } else {
            updatedFields.description = e.target.value;
        }
        
        setUpdatedFields(updatedFields)
    }
    return (
    <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Editing {task.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {Object.entries(fields).map(([k, v], i) => 
            <Form key={i} className="clearfix text-center">

                <Form.Group>
                    <Form.Label className="bg-dark text-white m-1 p-2 rounded">{k +': '}</Form.Label>
                    <Form.Control type="text" name="value" defaultValue={v} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, k)}/>

                </Form.Group>
            </Form>
            )}
            {Object.entries(readOnlyFields).map(([k, v], i) => 
                <Form.Group key={i} className="mt-3 m-1 p-2 text-white bg-dark">
                    <Form.Label key={`label-${i}`} className="text-white bg-dark">{`${k}:  ${v}`}</Form.Label>
                </Form.Group>
            )}
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateTaskFields(task.id, updatedFields)}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
)}

function getTaskColour(task: InputTask) {
    return task.status == TaskStatus[TaskStatus.Done] ? 'bg-success' : 'bg-warning';
}
