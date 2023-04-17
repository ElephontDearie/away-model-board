import { CreateTaskArgs } from "../components/createTask";
import { Editable } from "../components/task";

// Retrieve all tasks
export const fetchTasks = async (): Promise<Response> => {
    const res = await fetch('/api/tasks', {
        method: 'GET'
    });
    return res;
}

// Retrieve all tasks with a unique id
export const fetchTaskWithId = async (id: number): Promise<Response> => {
    return await fetch(`/api/tasks/${id}`, {
        method: 'GET',
    })
}

// Update a task with a task status or a sprint id
export const updateTask = async (taskId: number, taskStatus?: string, sprintId?: number): Promise<Response> => {
    let update = {};
    if (taskStatus) {
        update = {...update, status: taskStatus}
    }
    if (sprintId) {
        update = {...update, sprintId}
    }

    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(update)
    });
}

// Edit a task's editable fields
export const updateEditableFields = async (taskId: number, editableFields: Editable): Promise<Response> => {
    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(editableFields)
    });
}

// Delete a task from the databse given its task ID
export const deleteTask = async (taskId: number): Promise<Response> => {
    return await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: taskId
        })
    });
}

// Create a task
export const createTask = async (pendingTask: CreateTaskArgs): Promise<Response> => {
    return await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingTask),
      });
}