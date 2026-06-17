import express from "express";
import {
  getUserWorkspaces,
  getWorkspace,
  createWorkspace,
} from "../controllers/workspace.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post("/get", protect, createWorkspace);
router.get("/get-workspaces", protect, getUserWorkspaces);
router.get("/:workspaceId", protect, getWorkspace)

export default router;
