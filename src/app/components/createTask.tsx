import { InputTask, TaskStatus } from "./task";

export type CreateTaskArgs = {
  title: string;
  description: string;
  status: string;
}

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = TaskStatus[TaskStatus["To Do"]]

    const pendingTask: CreateTaskArgs = {
      title,
      description,
      status
    } 

    try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pendingTask),
    });
      console.log(res);
      // const newTask = await res.json();
      // console.log(newTask);
    } catch (error) {
      console.log(error);
  }
};



export const AddTaskForm = () => 
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required />
        <input type="text" name="description" placeholder="Description" required />
        <button type="submit">Add Task</button>
      </form>
    </>
