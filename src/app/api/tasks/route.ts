import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();


// Creating a new task with the POST HTTP method.
export async function POST(req: Request) {
  const { title, description, status, authorId, sprintId } = await req.json();
  try {
    const newTask: Task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        authorId,
        sprintId
      },

    });

    return new Response(JSON.stringify(newTask), {
      status: 201
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return new Response(JSON.stringify('Please choose a title which does not already exist.'), {
          status: 500
        })
      }
    }
    console.error(error);
    return new Response(JSON.stringify('Error creating task'), {
      status: 500
    })
  }
} 

// Retrieving all tasks from the Prisma database with the GET HTTP method.
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