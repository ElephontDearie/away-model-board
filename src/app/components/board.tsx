"use client"; // this is a client component 

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/reducers';
// import { fetchTasks, createTask, deleteTask } from '../redux/actions';
import { useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useState } from 'react';
import { InputTask, TaskItem, TaskStatus } from './task';
import { AddTaskForm } from './createTask';

import "../sass/task.scss";
import { fetchTasks, updateTask } from '../handlers/task';

// type Props = {
//   peerInProgress?: boolean;
//   peerCodeReview?: boolean;
// };

type Props = {
  peerReview?: boolean;
};

function isColString(col: TaskStatus | string): col is string {
  return typeof col === 'string';
  // (col as string). !== undefined;
}



function SprintBoard(props: Props) {
  const peerReview = props.peerReview || false;
  let peerInProgress: boolean, peerCodeReview: boolean = peerReview;

  const tasks = useSelector((state: RootState) => state.tasks);

  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [shownTasks, setShownTasks] = useState<InputTask[] | null>(null);
  const [draggedIssue, setDraggedIssue] = useState<null | InputTask>(null);

  useEffect(() => {
    // dispatch(fetchTasks());
    setLoading(true);
    const fetchData = async () => {
      const response = await fetchTasks();
      const tasks: InputTask[] = await response.json();
      setShownTasks(tasks);
      setLoading(false);
      
    } 
    fetchData().catch(error => console.log(error));
  }, []);
  // useEffect(() => {
  //   // import("bootstrap/dist/js/bootstrap");
  //   require("bootstrap/dist/js/bootstrap.bundle.min.js");
  // }, []);


  const columns: string[] = Object.values(TaskStatus).filter(isColString);
  if (props.peerReview) columns.splice(4, 1);

  const renderColItems = (col: string) => {
    return shownTasks && shownTasks.filter(t => t.status.toString() == col)
      .map(t => 
      <TaskItem key={t.id} peerTeam task={t} setDraggedIssue={setDraggedIssue} />); 
    
  } 

  const handleDragOver = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  const handleDrop = (event: { preventDefault: () => void; }, col: string) => {
    event.preventDefault();
    const updatedIssues = shownTasks && shownTasks.map(task => {
      if (draggedIssue && task.id === draggedIssue.id) {
        // task.status = TaskStatus[col as keyof typeof TaskStatus];
        updateTask(task.id, col).catch(console.error)
      }
      return task;
    });
    setShownTasks(updatedIssues);
    setDraggedIssue(null);
  };
  return (
    <div>
      <AddTaskForm />
      <div className='container-fluid board'>

        <div className="row">
          {columns.map(col => 
            <div key={col.valueOf()} 
              className="col bg-primary text-white border border-white h4"
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