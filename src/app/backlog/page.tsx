"use client";
import { useEffect, useState } from "react"
import { fetchTasks } from "../handlers/task"
import { EditModal, InputTask } from "../components/task";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default function Backlog() {
    const [tasks, setTasks] = useState<InputTask[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [showTaskModal, setShowTaskModal] = useState<boolean>(false);


    useEffect(() => {
        const fetchData = async () => {
          const response = await fetchTasks();
          const tasks: InputTask[] = await response.json();
          setTasks(tasks);
          setLoading(false);
          
        } 
        fetchData().catch(error => console.log(error));
      }, [tasks]);
    return (
        <main>
            <ListGroup>
                {tasks && tasks.map(task => 
                    
                    <ListGroupItem key={task.id} onClick={() => setShowTaskModal(true)}>
                        {task.title}
                        {showTaskModal && 
                            <EditModal task={task} setShowModal={setShowTaskModal} showModal={showTaskModal} />}
                        </ListGroupItem>
                    
                )}
            </ListGroup>
        </main>


    )
}
