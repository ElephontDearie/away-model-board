"use client"; // this is a client component 

// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../redux/reducers';
// import { fetchTasks, createTask, deleteTask } from '../redux/actions';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import { InputTask, TaskItem, TaskStatus } from './task';
import { AddTaskForm } from './createTask';

import "../sass/task.scss";
import { fetchTasks, updateTask } from '../handlers/task';
import { useAuthContext } from '../context/AuthContext';
import { fetchSprintWithId } from '../handlers/sprint';
import { CompleteSprint } from '../api/sprints/[id]/route';
import { Sprint, Task } from '@prisma/client';
import { ActiveSprintBanner } from './sprint';

type SprintProps = {
  sprint: Sprint;
  peerReview?: boolean;
  isAdmin: boolean;
};

function isColString(col: TaskStatus | string): col is string {
  return typeof col === 'string';
}



function SprintBoard(props: SprintProps) {
  const user = useAuthContext();
  // const { isAdmin } = props;

  const peerReview = props.peerReview || false;
  let peerInProgress: boolean, peerCodeReview: boolean = peerReview;
  const isAdmin = props.isAdmin;
  const sprintId = props.sprint?.id;
  const sprintStatus = props.sprint?.status;
  // const tasks = useSelector((state: RootState) => state.tasks);
  // const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [shownTasks, setShownTasks] = useState<Task[] | null>(null);
  const [draggedIssue, setDraggedIssue] = useState<null | Task>(null);
  // const [shownTasks, setShownTasks] = useState<InputTask[] | null>(null);
  // const [draggedIssue, setDraggedIssue] = useState<null | InputTask>(null);

  useEffect(() => {
    // dispatch(fetchTasks());
    setLoading(true);
    const fetchData = async () => {
      const response = await fetchSprintWithId(sprintId);
      const sprintWithTasks: CompleteSprint = await response.json();

      const tasks: Task[] = sprintWithTasks.tasks;
      setShownTasks(tasks);
      setLoading(false);
      
    } 
    fetchData().catch(error => console.log(error));
  }, [shownTasks, props.sprint]);


  const columns: string[] = Object.values(TaskStatus).filter(isColString);
  if (props.peerReview) columns.splice(4, 1);

  const renderColItems = (col: string) => {
    return shownTasks && shownTasks.filter(t => t.status.toString() == col)
      .map(t => 
      <TaskItem key={t.id} peerTeam task={t} setDraggedIssue={setDraggedIssue} isAdmin={isAdmin}/>); 
    
  } 

  const handleDragOver = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  const handleDrop = (event: { preventDefault: () => void; }, col: string) => {
    event.preventDefault();
    const updatedIssues = shownTasks && shownTasks.map(task => {
      if (draggedIssue && task.id === draggedIssue.id) {
        updateTask(task.id, col).catch(console.error)
      }
      return task;
    });
    setShownTasks(updatedIssues);
    setDraggedIssue(null);
  };
  return (
    <div>
      <ActiveSprintBanner sprint={props.sprint}/>
      {user && user.displayName && <AddTaskForm authorId={user.displayName} sprintId={sprintId} />}
      <div className='container-fluid'>

        <div className="row">
          {columns.map(col => 
            <div key={col.valueOf()} 
              className="col sprint-col text-white border border-white h4"
              onDragOver={event => handleDragOver(event)}
              onDrop={event => handleDrop(event, col)}>
              {col}
              {/* {loading && <h2>loading...</h2>} */}
              {renderColItems(col)}
              {/* {shownTasks && console.log(shownTasks)} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    
export default SprintBoard;