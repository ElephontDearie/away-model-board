import { PrismaClient, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function PUT(req: Request, { params }) {
    console.log('in update')
    const id = parseInt(params.id);
    console.log(id)
    const { status } = await req.json();
    console.log(status)
    try {
        const updatedTask: Task = await prisma.task.update({
            where: {
                id
            },
            data: {
                status
        },
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