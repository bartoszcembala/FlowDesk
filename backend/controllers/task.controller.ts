import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.status(200).json({
      message: "Task deleted successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
}
