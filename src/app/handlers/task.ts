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