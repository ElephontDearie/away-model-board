import { NextResponse } from "next/server";
import { Editable } from "../components/task";
export const fetchTasks = async (): Promise<Response> => {
    const res = await fetch('/api/tasks', {
        method: 'GET'
    });
    return res;
}

export const updateTask = async (taskId: string, taskStatus: string): Promise<Response> => {
    const statusUpdate = {
        status: taskStatus
    }

    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(statusUpdate)
    });
}


export const updateEditableFields = async (taskId: string, editableFields: Editable): Promise<Response> => {

    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(editableFields)
    });
}

export const deleteTask = async (taskId: string): Promise<Response> => {
    return await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: taskId
        })
    });
}