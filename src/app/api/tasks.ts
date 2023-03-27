import type { NextApiRequest, NextApiResponse } from 'next'
// import Task from '../../model';
// export default function handler(req, res) {
//     const data = {
//       message: 'Hello from the backend!',
//     };
//     res.status(200).json(data);
//   }

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { title, description, status, sprintId } = req.body;

//       const task = await Task.create({
//         title,
//         description,
//         status,
//         sprintId,
//       });

//       res.status(201).json(task);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error creating task' });
//     }
//   } else {
//     res.status(400).json({ error: 'Invalid request method' });
//   }
// }

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    // We create a new Task
    const newTask = await prisma.task.create({
      data: {
        title: "task-1",
        description: "desc",
        status: "To Do"
      },
    });

    console.log("New Task:");
    console.log(newTask);
    return res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
} 



  