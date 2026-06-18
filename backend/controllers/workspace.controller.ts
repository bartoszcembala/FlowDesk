import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function createWorkspace(req: Request, res: Response) {
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

export const getUserWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const workspaces = await prisma.workspace.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        columns: {
          orderBy: {
            position: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        workspaces,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get workspaces",
    });
  }
};

export const getWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.userId;

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        userId,
      },
      include: {
        columns: {
          orderBy: {
            position: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    return res.status(200).json({
      data: {
        workspace,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export async function updateTaskCompleted(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      res.status(400).json({
        message: "completed must be a boolean",
      });
      return;
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        completed,
      },
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
}

