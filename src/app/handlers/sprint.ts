import { CreateSprintArgs } from "../components/sprint";

type StatusUpdate = {
    status: string;
    endDate?: Date;
}

// Retrieve all sprints
export const fetchSprints = async (): Promise<Response> => {
    return await fetch('/api/sprints', {
        method: 'GET'
    });
}

// Retrieve sprint with a particular id
export const fetchSprintWithId = async (id: number): Promise<Response> => {
    return await fetch(`/api/sprints/${id}`, {
        method: 'GET'
    });
}

// Update sprint with a status or a status and endDate
export const updateSprint = async (sprintId: number, sprintStatus: string, endDate?: Date): Promise<Response> => {
    let statusUpdate: StatusUpdate = {
        status: sprintStatus
    }
    if (endDate) {
        statusUpdate = {...statusUpdate, endDate: endDate}
    }

    return await fetch(`/api/sprints/${sprintId}`, {
        method: 'PUT',
        body: JSON.stringify(statusUpdate)
    });
}

// Create a new sprint with the POST HTTP method
export const createSprint = async (pendingSprint: CreateSprintArgs) => {
    return await fetch('/api/sprints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingSprint),
      });
}


// export const updateEditableFields = async (taskId: string, editableFields: Editable): Promise<Response> => {

//     return await fetch(`/api/tasks/${taskId}`, {
//         method: 'PUT',
//         body: JSON.stringify(editableFields)
//     });
// }

export const deleteSprint = async (sprintId: string): Promise<Response> => {
    return await fetch(`/api/sprints/${sprintId}`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: sprintId
        })
    });
}