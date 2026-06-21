import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import taskRoutes from "./routes/task.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
