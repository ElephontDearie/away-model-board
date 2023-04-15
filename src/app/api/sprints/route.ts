import { PrismaClient, Sprint } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: Request) {
  const { title, goal, status, startDate } = await req.json();
  try {
    const newSprint: Sprint = await prisma.sprint.create({
      data: {
        title,
        goal,
        status,
        startDate
      },
    });

    return new Response(JSON.stringify(newSprint), {
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
    console.log(error);
    return new Response(JSON.stringify('Error creating sprint'), {
      status: 500
    })
  }
} 

export async function GET(req: Request) {
  try {
    const sprints: Sprint[] = await prisma.sprint.findMany();
    return new Response(JSON.stringify(sprints), {
      status: 200
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), {
      status: 500
    })
  }
}
