// import { CreateSprintArgs } from "@/app/components/createSprint";
import { PrismaClient, Sprint } from "@prisma/client";

const prisma = new PrismaClient();

// interface CreateSprintRequest extends NextRequest {
//   body: CreateSprintArgs
// }

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
// type CreateSprintRequest = Override<NextRequest, {body: CreateSprintArgs}>

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
    console.error(error);
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
    console.error(error);
    return new Response('Error fetching sprints', {
      status: 500
    })
  }
}
