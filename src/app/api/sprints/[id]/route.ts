import { PrismaClient, Sprint, Task } from "@prisma/client";

const prisma = new PrismaClient();


type UpdateFields = {
  endDate: string,
  status: string
}

export type CompleteSprint = {
  sprint: Sprint;
  tasks: Task[];
}

// Update a sprint with an status and endDate to update sprint status or close the sprint.
export async function PUT(req: Request, { params }: { params: { id: string } } ) {
    const id = parseInt(params.id);
    const input: UpdateFields = await req.json();

    try {
      const updatedSprint: Sprint = await prisma.sprint.update({
        where: {
            id
        },
        data: input
      });
    
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify('Error updating Sprint'), {
      status: 500
    })
  }
} 

// Delete a sprint from the Sprint table.
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
      const deletedSprint: Sprint = await prisma.sprint.delete({
          where: {
              id
          },
      })
  
    return new Response(null, {
      status: 204
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify('Error updating Sprint'), {
      status: 500
    })
  }
}


// Retrieve a specific sprint from the Sprint table by providing its unique sprint ID.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
      const sprintWithId: Sprint = await prisma.sprint.findFirstOrThrow({
          where: {
              id
          },
      })
      const sprintTasks: Task[] = await prisma.task.findMany({
        where: {
          sprintId: id
        }
      })
      const sprintWithTasks: CompleteSprint = {
        sprint: sprintWithId,
        tasks: sprintTasks
      }
  
    return new Response(JSON.stringify(sprintWithTasks), {
      status: 200
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify(error.message), {
      status: 500
    })
  }
}