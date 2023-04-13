"use client";
import { useEffect, useState } from "react"
import { fetchTasks, updateTask } from "../handlers/task"
import { EditModal, InputTask, TaskStatus } from "../components/task";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { AddTaskForm } from "../components/createTask";
import { useAuthContext } from "../context/AuthContext";
import { Sprint, Task } from "@prisma/client";
import { SprintStatus } from "../components/sprint";
import { fetchSprints } from "../handlers/sprint";
import { ErrorModal, Outcome, SuccessModal } from "../components/userInfo";
import { LoadingPage } from "../components/load";

export default function Backlog() {
    const {user, isAdmin} = useAuthContext()
    const [tasks, setTasks] = useState<Task[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
    const [activeSprintExists, setActiveSprintExists] = useState<boolean>(false)
    const [activeSprintId, setActiveSprintId] = useState<number>();
    const [outcome, setOutcome] = useState<{taskId: number, result: Outcome, message: string}>()
    const [showMessage, setShowMessage] = useState<boolean>(false);


    useEffect(() => {
        const fetchData = async () => {
          const response = await fetchTasks();
          const tasks: Task[] = await response.json();
          setTasks(tasks);          
        } 

        const setActive = async () => {
            const response = await fetchSprints();
            const sprintList: Sprint[] = await response.json();
            const activeSprint = sprintList.find(sprint => sprint.status == SprintStatus[SprintStatus.Active])
            if (!!activeSprint) {
                setActiveSprintExists(true)
                setActiveSprintId(activeSprint.id)
            }
        }
        fetchData().catch(error => console.log(error));
        setActive().catch(error => console.log(error));
        setLoading(false);
      }, [tasks, activeSprintExists]);

      const activeSprintHasTask = (taskSprintId: number | null): boolean => activeSprintId == taskSprintId;

      const sendToActiveSprint = async (taskId: number) => {
        try {
            const res = await updateTask(taskId, undefined, activeSprintId);
            setOutcome({taskId, result: Outcome.Success, message: "Task added to backlog!"})
        } catch (error) {
            if (error instanceof Error) {
                setOutcome({taskId, result: Outcome.Error, message: error.message})
            } else if (typeof error == "string") {
                setOutcome({taskId, result: Outcome.Error, message: error})

            }
            console.error(error);
        }
      }

    return (
        <>
            {loading && <LoadingPage />}
            {!loading && <main>
                <h1 className={"text-center mt-3"}>Backlog</h1>

                {user && user.displayName && <AddTaskForm authorId={user.displayName} />}
                <ListGroup>
                    {tasks && tasks.map(task => 
                        <ListGroup horizontal style={{ display: 'flex' }} className={"d-flex flex-fill w-100"} key={task.id}>

                            <ListGroupItem key={`title-${task.id}`} onClick={() => setShowTaskModal(true)} className="flex-fill">
                                <div>{task.title}</div>
                                <EditModal task={task} setShowModal={setShowTaskModal} showModal={showTaskModal} />
                            </ListGroupItem>
                            {activeSprintExists && !activeSprintHasTask(task.sprintId) && task.status != TaskStatus[TaskStatus.Done] &&

                                <ListGroupItem key={`active-${task.id}`} className="flex-fill-1">
                                    <Button onClick={() => sendToActiveSprint(task.id)}>
                                        Add to active sprint
                                    </Button>
                                </ListGroupItem>
                            }
                            {task.id == outcome?.taskId && 
                                <div>
                                    <SuccessModal key={`active-success-${task.id}`} message="Added to the currently active sprint!" showMessage={outcome?.result == Outcome.Success} setShowMessage={setShowMessage}/>
                                    <ErrorModal key={`active-failure-${task.id}`} message={outcome?.message || "Could not add to the currently active sprint."} showMessage={outcome?.result == Outcome.Error} setShowMessage={setShowMessage} />       
                                </div>
                            }
                            </ListGroup>
                        
                    )}
                </ListGroup>
            </main>}
        </>


    )
}
