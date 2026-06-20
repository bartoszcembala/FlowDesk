import express from "express";
import {
  getUserWorkspaces,
  getWorkspace,
  createWorkspace,
  updateTaskCompleted,
  updateWorkspaceLayout,
  addWorkspaceMember,
  getWorkspaceMessages,
  createColumn,
} from "../controllers/workspace.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post("/get", protect, createWorkspace);
router.post("/:workspaceId/members", protect, addWorkspaceMember);
router.get("/get-workspaces", protect, getUserWorkspaces);
router.get("/:workspaceId", protect, getWorkspace);
router.patch("/:taskId/completed", protect, updateTaskCompleted);
router.patch("/:workspaceId/layout", protect, updateWorkspaceLayout);
router.get("/:workspaceId/messages", protect, getWorkspaceMessages);
router.post("/:workspaceId/columns", protect, createColumn);

export default router;
