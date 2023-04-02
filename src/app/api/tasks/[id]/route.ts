import { PrismaClient, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type updateStatus = {
  status: string
}
type updateFields = {
  status: string,
  description: string,
  title: string
}
export async function PUT(req: Request, { params }) {
    const id = parseInt(params.id);
    const input: updateStatus | updateFields = await req.json();



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
    console.log(error);
    return new Response(JSON.stringify('Error updating task'), {
      status: 500
    })
  }
} 

export async function DELETE(req: Request, { params }) {
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