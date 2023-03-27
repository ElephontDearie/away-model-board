import { NextResponse } from "next/server";
export const fetchTasks = async (): Promise<Response> => {
    const res = await fetch('/api/tasks', {
        method: 'GET'
    });
    console.log(res)
    return res;
}

export const updateTask = async (taskId: string, taskStatus: string): Promise<Response> => {
    return await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
            status: taskStatus
        })
    });
}