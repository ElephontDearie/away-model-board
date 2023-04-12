import { useSelector, useDispatch } from 'react-redux';

// import { RootState } from '../redux/reducers';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "../sass/task.scss"
import { updateEditableFields } from '../handlers/task';
import { Form } from 'react-bootstrap';
import { ConfirmDeleteModal, CrudConfirmProps } from './userInfo';
import { Task } from '@prisma/client';


export enum TaskStatus {
    'To Do',
    'Blocked', 
    'In Progress', 
    'In Code Review', 
    'In Peer Code Review', 
    'Deployed', 
    'Done'
}

export type InputTask = {
    id: number,
    title: string,
    description: string,
    status: string //set as to-do on creation
}


type taskOptions = {
    peerTeam: boolean,
    // task: InputTask,
    // setDraggedIssue: Dispatch<SetStateAction<InputTask | null>>,
    task: Task,
    setDraggedIssue: Dispatch<SetStateAction<Task | null>>,
    isAdmin: boolean
}

export const TaskItem = (props: taskOptions): JSX.Element => {
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    // const [deleteId, setDeleteId] = useState<string>('');
    // const task = props.task;
    const {task, isAdmin} = props;

    // const dispatch = useDispatch();
    const router = useRouter();

    const confirmDeleteProps: CrudConfirmProps = {
        taskIdentifier: task.id,
        taskTitle: task.title,
        showModal: showDeleteModal,
        setShowModal: setShowDeleteModal,
        // operationMethod: deleteTask(task.id)
    }

    const handleDragStart = (event: any, task: SetStateAction<null | Task>) => {
        task && props.setDraggedIssue(task);
    };

    const inputTask: InputTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status
    }
    // const taskNo: number = parseInt(task.id);
    const taskNo: number = task.id;


    return (
        <div className={"card col border border-black " + getTaskColour(task)}
            draggable
            onDragStart={event => handleDragStart(event, task)}
        >
            <h6 className="card-title text-dark">{task.id}</h6>
            <h5 className="card-title bg-dark">{task.title}</h5>
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
type Displayable = {
    status: string;
    // author: string;
    // created: string;
    // lastUpdated: string;
}

export type Editable  = {
    title: string;
    description: string;
    // status: string;
}
const editableFields = (task: InputTask): Editable => ({
    title: task.title,
    description: task.description,
    // status: task.status.toString()
})
const readableFields = (task: InputTask): Displayable => ({
    status: task.status.toString(),
    // author: task.author,
    // created: task.creationTime,
    // lastUpdated: task.lastUpdatedTime
})

type EditProps = {
    task: InputTask; 
    showModal: boolean; 
    setShowModal: Dispatch<SetStateAction<boolean>>;
}
export const EditModal = (props: EditProps): JSX.Element => {
    const { task, showModal, setShowModal } = props;
    const [showEditBox, setShowEditBox] = useState(false);
    const fields: Editable = editableFields(task);
    const readOnlyFields: Displayable = readableFields(task)
    const [updatedFields, setUpdatedFields] = useState<Editable>(fields);


    const updateTaskFields = (id: number, updatedFields: Editable) => {
        updateEditableFields(task.id, updatedFields);
        setShowModal(prev => false);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (field == 'title') {
            updatedFields.title = e.target.value;
        // } else if (field == 'status') {
        //     updatedFields.status = e.target.value;
        } else {
            updatedFields.description = e.target.value;
        }
        
        setUpdatedFields(updatedFields)
    }
    return (
    <Modal show={showModal} onHide={() => setShowModal(prev => false)} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Editing {task.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {Object.entries(fields).map(([k, v], i) => 
            <Form onSubmit={() => setShowEditBox(prev => false)} key={i} className='clearfix'>

                <Form.Group>
                    <Form.Label>{k +': '}</Form.Label>
                    <Form.Control type='text' name='value' defaultValue={v} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, k)}/>

                </Form.Group>
            </Form>
            )}
            {Object.entries(readOnlyFields).map(([k, v], i) => <span key={i}>{k + ": " + v}</span>)}

            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(prev => false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => updateTaskFields(task.id, updatedFields)}>Save Changes</Button>
        </Modal.Footer>


    </Modal>
)}

function getTaskColour(task: InputTask) {
    return task.status == TaskStatus[TaskStatus.Done] ? 'bg-success' : 'bg-warning';
}
