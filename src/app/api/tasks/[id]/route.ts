import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateStatus = {
  status: string;
}
type UpdateSprint = {
  sprintId: number;
}

type UpdateFields = {
  status: string,
  description: string,
  title: string
}

// Updating a task which already exists with fields of the type  UpdateStatus, UpdateSprint, or UpdateFields. 
export async function PUT(req: Request, { params }: { params: { id: string } } ) {
    const id = parseInt(params.id);
    const input: UpdateStatus | UpdateSprint | UpdateFields = await req.json();

    try {
      const updatedTask: Task = await prisma.task.update({
        where: {
            id
        },
        data: input
      });
    
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify('Error updating task'), {
      status: 500
    })
  }
} 

// Delete a task given its task ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
      const deletedTask: Task = await prisma.task.delete({
          where: {
              id
          },
      })
  
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify('Error updating task'), {
      status: 500
    })
  }
}

// For retrieving a task with a particular ID.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const isTaskId: boolean = await req.json();

  try {
    const task: Task = await prisma.task.findFirstOrThrow({
        where: {
            id
        },
    })

    return new Response(null, {
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(`Error retrieving task with ID ${id}`), {
      status: 500
    })
  }
  
}