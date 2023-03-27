import { CreateTaskArgs } from "@/app/components/createTask";
import { PrismaClient, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// interface CreateTaskRequest extends NextRequest {
//   body: CreateTaskArgs
// }

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
type CreateTaskRequest = Override<NextRequest, {body: CreateTaskArgs}>

export async function POST(req: Request) {
  const { title, description, status } = await req.json();
  try {
    const newTask: Task = await prisma.task.create({
      data: {
        title,
        description,
        status
      },

    });

    return new Response(JSON.stringify(newTask), {
      status: 201
    });
  } catch (error) {
    console.error(error);
    // return NextResponse.
    return new Response(JSON.stringify('Error creating task'), {
      status: 500
    })
  }
} 

export async function GET(req: Request) {
  try {
    const tasks: Task[] = await prisma.task.findMany();
    return new Response(JSON.stringify(tasks), {
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching tasks', {
      status: 500
    })
  }
} 