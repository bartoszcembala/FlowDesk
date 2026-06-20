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

        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },

        columns: {
          create: [
            {
              title: "Backend",
              position: 0,
              tasks: {
                create: [
                  { title: "Learn Prisma", position: 0 },
                  { title: "Setup React app", position: 1 },
                  { title: "Read API docs", position: 2 },
                ],
              },
            },
            {
              title: "Frontend",
              position: 1,
              tasks: {
                create: [
                  { title: "Build Kanban board", position: 0 },
                  { title: "Implement drag & drop", position: 1 },
                  { title: "Connect backend", position: 2 },
                ],
              },
            },
            {
              title: "Deployment",
              position: 2,
              tasks: {
                create: [
                  { title: "Create project", position: 0 },
                  { title: "Install dependencies", position: 1 },
                  { title: "Setup database", position: 2 },
                ],
              },
            },
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return res.status(201).json({
      data: {
        workspace,
      },
    });
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
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
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
      data: { workspaces },
    });
  } catch (err) {
    console.error(err);

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
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
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

export async function updateWorkspaceLayout(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { workspaceId } = req.params;
    const { columns } = req.body;

    if (!Array.isArray(columns)) {
      res.status(400).json({
        message: "Columns must be an array",
      });
      return;
    }

    await prisma.$transaction(
      columns.flatMap((column: any, columnIndex: number) => [
        prisma.column.update({
          where: {
            id: column.id,
          },
          data: {
            position: columnIndex,
          },
        }),

        ...column.tasks.map((task: any, taskIndex: number) =>
          prisma.task.update({
            where: {
              id: task.id,
            },
            data: {
              columnId: column.id,
              position: taskIndex,
            },
          }),
        ),
      ]),
    );

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
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

    res.status(200).json({
      message: "Workspace layout updated",
      data: {
        workspace,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update workspace layout",
    });
  }
}

export async function addWorkspaceMember(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const ownerMembership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: "OWNER",
      },
    });

    if (!ownerMembership) {
      return res.status(403).json({
        message: "Only workspace owner can add members",
      });
    }

    const userToAdd = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userToAdd) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userToAdd.id,
          workspaceId,
        },
      },
    });

    if (existingMember) {
      return res.status(409).json({
        message: "User is already a member",
      });
    }

    const member = await prisma.workspaceMember.create({
      data: {
        userId: userToAdd.id,
        workspaceId,
        role: "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json({
      data: {
        member,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to add member",
    });
  }
}

export async function getWorkspaceMessages(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const userId = req.userId;

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: "No access to this workspace",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: {
        messages,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to get messages",
    });
  }
}

export async function createColumn(req: Request, res: Response) {
  try {
    const { workspaceId } = req.params;
    const { title } = req.body;
    const userId = req.userId;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Column title is required" });
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!membership) {
      return res.status(403).json({ message: "No access to this workspace" });
    }

    const lastColumn = await prisma.column.findFirst({
      where: { workspaceId },
      orderBy: { position: "desc" },
    });

    const column = await prisma.column.create({
      data: {
        title,
        workspaceId,
        position: lastColumn ? lastColumn.position + 1 : 0,
      },
      include: {
        tasks: true,
      },
    });

    return res.status(201).json({
      data: {
        column,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create column",
    });
  }
}
