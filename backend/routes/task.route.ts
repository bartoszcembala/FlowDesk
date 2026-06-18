import express from "express";
import { protect } from "../middleware/protect";
import { createTask, deleteTask } from "../controllers/task.controller";

const router = express.Router();

router.delete("/:taskId", protect, deleteTask);
router.post("/", protect, createTask);

export default router;
