import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function getWorkspace(req: Request, res: Response) {
  console.log(req.body);
  const { name } = req.body;
  const userId = req.userId;

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        userId,

        columns: {
          create: [
            {
              title: "To Do",
              position: 0,
              tasks: {
                create: [
                  {
                    title: "Learn Prisma",
                    position: 0,
                  },
                  {
                    title: "Setup React app",
                    position: 1,
                  },
                  {
                    title: "Read API docs",
                    position: 2,
                  },
                ],
              },
            },
            {
              title: "Doing",
              position: 1,
              tasks: {
                create: [
                  {
                    title: "Build Kanban board",
                    position: 0,
                  },
                  {
                    title: "Implement drag & drop",
                    position: 1,
                  },
                  {
                    title: "Connect backend",
                    position: 2,
                  },
                ],
              },
            },
            {
              title: "Done",
              position: 2,
              tasks: {
                create: [
                  {
                    title: "Create project",
                    position: 0,
                  },
                  {
                    title: "Install dependencies",
                    position: 1,
                  },
                  {
                    title: "Setup database",
                    position: 2,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return res.status(201).json({ data: { workspace } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create workspace",
    });
  }
}
