import { SprintStatus } from "@/app/components/sprint";
import { PrismaClient, Sprint, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


type updateFields = {
  endDate: string,
  status: string
}
export async function PUT(req: Request, { params }: { params: { id: string } } ) {
    const id = parseInt(params.id);
    const input: updateFields = await req.json();
    console.log(input)

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

export type CompleteSprint = {
  sprint: Sprint;
  tasks: Task[];
}

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
  } catch (error) {
    console.log(error);
    return new Response('Error retrieving Sprint', {
      status: 500
    })
  }
}