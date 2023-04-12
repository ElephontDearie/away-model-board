import { Editable } from "../components/task";

// To retrieve all tasks
export const fetchTasks = async (): Promise<Response> => {
    const res = await fetch('/api/tasks', {
        method: 'GET'
    });
    return res;
}

// To retrieve all tasks with a unique id.
export const fetchTaskWithId = async (id: number): Promise<Response> => {
    return await fetch(`/api/tasks/${id}`, {
        method: 'GET',
    })
}

export const updateTask = async (taskId: number, taskStatus: string): Promise<Response> => {
    const statusUpdate = {
        status: taskStatus
    }

    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(statusUpdate)
    });
}


export const updateEditableFields = async (taskId: number, editableFields: Editable): Promise<Response> => {

    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(editableFields)
    });
}

export const deleteTask = async (taskId: number): Promise<Response> => {
    return await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: taskId
        })
    });
}