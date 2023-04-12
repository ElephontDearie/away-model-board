import { useState } from "react";
import { TaskStatus } from "./task";
import { ErrorModal, SuccessModal } from "./userInfo";

export interface CreateTaskArgs extends AddTaskProps {
  title: string;
  description: string;
  status: string;
}


type AddTaskProps = {
  authorId: string;
  sprintId: number;
}


export const AddTaskForm = (props: AddTaskProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  const[showSuccess, setShowSuccess] = useState<boolean>(false);
  const [outcomeMessage, setOutcomeMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowError(false);
    setShowSuccess(false)
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = TaskStatus[TaskStatus["To Do"]]
    const sprintId = props.sprintId
    const authorId = props.authorId

    const pendingTask: CreateTaskArgs = {
      title,
      description,
      status,
      authorId,
      sprintId
    } 

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pendingTask),
    });

      if (res.status == 500) {
        const errorMessage = await res.json();
        setOutcomeMessage(errorMessage)
        setShowError(true);
        setTimeout(() => {
          setShowError(false)
        }, 5000)
      } else {
        setOutcomeMessage(`Task named "${title}" was successfully added to the sprint!`)
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false)
        }, 5000)
      }
  };

  return (
  <>
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" required />
      <input type="text" name="description" placeholder="Description" required />
      <button type="submit">Add Task</button>
    </form>

    <ErrorModal setShowMessage={setShowError} showMessage={showError} message={outcomeMessage}/>
    <SuccessModal setShowMessage={setShowSuccess} showMessage={showSuccess} message={outcomeMessage}/>
    
  </>
  )
}

