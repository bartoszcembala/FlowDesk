import express from "express";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import taskRoutes from "./routes/task.route";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
