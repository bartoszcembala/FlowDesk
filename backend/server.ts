import express from "express";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import taskRoutes from "./routes/task.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    console.log("SOCKET RAW COOKIE:", socket.handshake.headers.cookie);
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Unauthorized"));
    }

    const parsedCookies = cookie.parse(cookies);

    const token = parsedCookies.jwt;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    socket.data.userId = decoded.id;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.on("workspace:join", async ({ workspaceId }) => {
    const userId = socket.data.userId;

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!membership) return;

    socket.join(`workspace:${workspaceId}`);
  });

  socket.on("workspace:leave", ({ workspaceId }) => {
    socket.leave(`workspace:${workspaceId}`);
  });

  socket.on("message:send", async ({ workspaceId, content }) => {
    console.log("MESSAGE SEND EVENT:", {
      workspaceId,
      content,
      userId: socket.data.userId,
    });

    const userId = socket.data.userId;

    if (!content?.trim()) return;

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    console.log("MEMBERSHIP:", membership);

    if (!membership) return;

    const message = await prisma.message.create({
      data: {
        content,
        workspaceId,
        userId,
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

    console.log("CREATED MESSAGE:", message);

    io.to(`workspace:${workspaceId}`).emit("message:new", message);
  });
});

app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", taskRoutes);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
