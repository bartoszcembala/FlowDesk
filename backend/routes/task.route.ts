import express from "express";
import { protect } from "../middleware/protect";
import { deleteTask } from "../controllers/task.controller";

const router = express.Router();

router.delete("/:taskId", protect, deleteTask);

export default router;
