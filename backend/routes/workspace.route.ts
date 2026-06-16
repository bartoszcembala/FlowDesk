import express from "express";
import { getWorkspace } from "../controllers/workspace.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.post("/get", protect, getWorkspace);

export default router;
