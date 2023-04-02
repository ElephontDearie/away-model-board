import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../redux/reducers';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "../sass/task.scss"
import { deleteTask, updateEditableFields } from '../handlers/task';
import { Form } from 'react-bootstrap';


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
    id: string,
    title: string,
    description: string,
    status: TaskStatus //set as to-do on creation
}


type taskOptions = {
    peerTeam: boolean,
    task: InputTask,
    setDraggedIssue: Dispatch<SetStateAction<InputTask | null>>
}

export const TaskItem = (props: taskOptions): JSX.Element => {
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const task = props.task;

    const dispatch = useDispatch();
    const router = useRouter();

    const openEditModal = (task: InputTask) => {
        setShowEditModal(true);
        // return EditModal(task, showEditModal, setShowEditModal)
        // router.push(`/tasks/${id}`);
    };
    const handleDelete = async (id: string) => {
        await deleteTask(id);
    };

    const handleDragStart = (event: any, task: SetStateAction<null | InputTask>) => {
        task && props.setDraggedIssue(task);
    };

    const inputTask: InputTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status
    }
    const taskNo: number = parseInt(task.id);

    return (
        <div className={"card col border border-black " + getTaskColour(task)}
            draggable
            onDragStart={event => handleDragStart(event, task)}
        >
            <h6 className="card-title text-muted">{task.id}</h6>
            <h5 className="card-title">{task.title}</h5>
            <h6 className="card-subtitle">{task.description}</h6>
            
            <section>
                <Button className='btn btn-outline-light' onClick={() => openEditModal(task)}>Edit</Button>
                <Button className='btn btn-danger btn-outline-dark' onClick={() => handleDelete(task.id)}>Delete</Button>
            </section>
            <EditModal task={task} showModal={showEditModal} setShowModal={setShowEditModal}/>
        </div>

    )
}

export type Editable  = {
    title: string;
    description: string;
    status: string;
}
const editableFields = (task: InputTask): Editable => ({
    title: task.title,
    description: task.description,
    status: task.status.toString()
})

type EditProps = {
    task: InputTask; 
    showModal: boolean; 
    setShowModal: Dispatch<SetStateAction<boolean>>;
}
const EditModal = (props: EditProps): JSX.Element => {
    const { task, showModal, setShowModal } = props;
    const [showEditBox, setShowEditBox] = useState(false);
    const fields: Editable = editableFields(task);
    const [updatedFields, setUpdatedFields] = useState<Editable>(fields);


    const updateTaskFields = (id: string, updatedFields: Editable) => {
        updateEditableFields(task.id, updatedFields);
        setShowModal(prev => false);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (field == 'title') {
            updatedFields.title = e.target.value;
        } else if (field == 'status') {
            updatedFields.status = e.target.value;
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
                    {/* <span>{k +': '} <b>{v}</b> </span> */}
                    <Form.Label>{k.toUpperCase() +': '}</Form.Label>
                    <Form.Control type='text' name='value' defaultValue={v} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, k)}/>

                </Form.Group>
            </Form>
            )}
            
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
    return task.status == TaskStatus.Done ? 'done-status' : 'bg-secondary';
}
