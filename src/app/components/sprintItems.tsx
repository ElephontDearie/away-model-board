import { useSelector, useDispatch } from 'react-redux';
import { Task } from '../types';

import { InputTask, TaskItem } from "./task";


type Props = {
    peerReview: boolean;
    tasks: InputTask[]
};

export const SprintTasks = (props: Props): JSX.Element => {
    let peerInProgress: boolean, peerCodeReview: boolean = props.peerReview;
    const tasks = props.tasks

    // const taskComponents: JSX.Element = tasks.map(task => <TaskItem peerR/>)
      
    return (
        <table>
            <tbody>
            {tasks.map((task) => (

                // <>
                // <tr key={task.id}>
                // <td>
                    <TaskItem peerTeam={true} task={task}/>
                // </td>
                // </>
            ))}
                {/* <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                    <input
                    type="checkbox"
                    checked={task.inProgress}
                    onChange={() => dispatch(updateTask({ ...task, inProgress: !task.inProgress }))}
                    />
                </td>
                {peerInProgress && (
                    <td>
                    <input
                        type="checkbox"
                        checked={task.peerInProgress}
                        onChange={() =>
                        dispatch(updateTask({ ...task, peerInProgress: !task.peerInProgress }))
                        }
                    />
                    </td>
                )}
                <td>
                    <input
                    type="checkbox"
                    checked={task.codeReview}
                    onChange={() => dispatch(updateTask({ ...task, codeReview: !task.codeReview }))}
                    />
                </td>
                {peerCodeReview && (
                    <>
                    <td>
                        <input
                        type="checkbox"
                        checked={task.peerCodeReview}
                        onChange={() =>
                            dispatch(updateTask({ ...task,
                            peerCodeReview: !task.peerCodeReview }))
                            }
                        />
                    </td> */}
                    {/* <td>
                        <button type="button" onClick={() => handleEdit(task.id)}>
                        Edit
                        </button>
                    </td>
                    <td>
                        <button type="button" onClick={() => handleDelete(task.id)}>
                        Delete
                        </button>
                    </td>
                    </>
                )}
                // </tr> */}
                // {/* ))} */}
            
            </tbody>
        </table>
    )
    
}