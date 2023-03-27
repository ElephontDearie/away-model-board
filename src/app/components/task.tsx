import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../redux/reducers';
import { useRouter } from 'next/navigation';
import { deleteTask } from '../redux/actions';
import { Dispatch, SetStateAction, useState } from 'react';
import "../sass/task.scss"

// export interface TaskType {
//     inputTask: InputTask,
//     inProgress: boolean,
//     peerInProgress: boolean,
//     codeReview: boolean,
//     peerCodeReview: boolean,
// }

export enum TaskStatus {
    'To Do',
    'Blocked', 
    'In Progress', 
    'In Code Review', 
    'In Peer Code Review', 
    'Deployed', 
    'Done'
}

// export const taskStatusToString {}

export type InputTask = {
    id: string,
    title: string,
    description: string,
    status: TaskStatus //set as to-do on creation
}


type taskOptions = {
    peerTeam: boolean,
    task: InputTask,
    // handleDragStart: (event: any, task: SetStateAction<null | InputTask>) => void
    setDraggedIssue: Dispatch<SetStateAction<InputTask | null>>
}

export const TaskItem = (props: taskOptions): JSX.Element => {
    const task = props.task;

    const dispatch = useDispatch();
    const router = useRouter();

    const handleEdit = (id: number) => {
        router.push(`/tasks/${id}`);
    };
    const handleDelete = async (id: number) => {
        await dispatch(deleteTask(id));
    };

    // const [draggedIssue, setDraggedIssue] = useState(null);

    // const handleDragStart = (event, issue) => {
    //   setDraggedIssue(issue);
    // };

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
                <button type="button" onClick={() => handleEdit(taskNo)}>
                    Edit
                </button>
                <button type="button" onClick={() => handleDelete(taskNo)}>
                    Delete
                </button>
            </section>
        </div>

    )
}

function getTaskColour(task: InputTask) {
    // console.log()
    // return task.status == TaskStatus.Done ? 'bg-secondary' : 'done-status';

    return task.status == TaskStatus.Done ? 'done-status' : 'bg-secondary';
}
