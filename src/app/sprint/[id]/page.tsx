"use client";
import { useEffect, useState } from 'react';
import { TaskItem, TaskStatus } from '../../components/task';
import { AddTaskForm } from '../../components/createTask';
import { updateTask } from '../../handlers/task';
import { useAuthContext } from '../../context/AuthContext';
import { fetchSprintWithId, fetchSprints } from '../../handlers/sprint';
import { CompleteSprint } from '../../api/sprints/[id]/route';
import { Sprint, Task } from '@prisma/client';
import { SprintBannerOnBoard, SprintStatus } from '../../components/sprint';
import { LoadingPage } from '@/app/components/load';


function isColString(col: TaskStatus | string): col is string {
  return typeof col === 'string';
}

function Board({params}: {params: {id: string}}) {
    const { user, isAdmin } = useAuthContext();
    const sprintId = parseInt(params.id);

    const [loading, setLoading] = useState<boolean>(true);
    const [shownTasks, setShownTasks] = useState<Task[] | null>(null);
    const [draggedIssue, setDraggedIssue] = useState<null | Task>(null);
    const [sprint, setSprint] = useState<Sprint | null> (null);
    const [activeSprintExists, setActiveSprintExists] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprintWithId(sprintId);
            const sprintWithTasks: CompleteSprint = await response.json();
            setSprint(sprintWithTasks.sprint);
            const tasks: Task[] = sprintWithTasks.tasks;
            setShownTasks(tasks);
        } 

        const setActivePreExists = async () => {
            const response = await fetchSprints();
            const sprintList: Sprint[] = await response.json();
            const activeSprint = sprintList.find(sprint => sprint.status == SprintStatus[SprintStatus.Active])
            !activeSprint && setActiveSprintExists(false);
        }

        fetchData().catch(error => setError(error.message));
        setActivePreExists().catch(error => setError(error.message))
        setLoading(false);

    }, [sprint, shownTasks, user]);


    const columns: string[] = Object.values(TaskStatus).filter(isColString);

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
        <>
            {loading && <LoadingPage />}
            {!loading && <div>
                {sprint && <SprintBannerOnBoard sprint={sprint} activeSprintExists={activeSprintExists} />}
                {user && user.displayName && <AddTaskForm authorId={user.displayName} sprintId={sprintId} />}
                <div className='container-fluid'>

                    <div className="row">
                        {columns.map(col => 
                            <div key={col.valueOf()} 
                                className="col sprint-col text-white border border-white h4"
                                onDragOver={event => handleDragOver(event)}
                                onDrop={event => handleDrop(event, col)}>
                                {col}
                                {renderColItems(col)}
                            </div>
                        )}
                    </div>
                </div>
            </div>}
        </>
        
    );
}
    
export default Board;