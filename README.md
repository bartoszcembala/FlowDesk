# 🧠 FlowDesk: Project Management App [APP IN DEVELOPMEN]

Full-stack real-time project management application inspired by Trello and Jira.  

---

## 🚀 Live Demo
IN WORK

---

## ⚙️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- dnd-kit (drag & drop)
- Socket.io Client
- React Hook Form + Zod

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.io
- JWT Authentication (httpOnly cookies)
- Zod validation

### DevOps
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Environment-based configuration

---

## ✨ Features

### 🔐 Authentication
- Register / Login / Logout
- JWT authentication via httpOnly cookies
- Protected routes
- User session handling

---

### 📁 Boards (Projects)
- Create / delete / manage boards
- Board ownership
- Multi-board dashboard

---

### 🧱 Columns (Kanban)
- Default and custom columns
- Reordering columns
- Persistent column positions

---

### ✅ Tasks
- Create / edit / delete tasks
- Task description and details
- Priority levels (Low / Medium / High / Critical)
- Due dates
- Task assignment to users

---

### 🖱️ Drag & Drop
- Move tasks between columns
- Reorder tasks inside columns
- Persistent ordering in database

---

### 💬 Comments
- Add / edit / delete comments
- Real-time comment updates
- Task discussion threads

---

### ⚡ Real-time Collaboration
- WebSocket (Socket.io)
- Live task updates
- Live comments
- Live board synchronization
- Active users indicator

---

### 👥 Team Collaboration
- Invite users to boards
- Role-based access control:
  - Owner
  - Admin
  - Member
  - Viewer

---

### 📊 Activity Log
- Track all board actions
- Task changes history
- Comment and update tracking
- Audit trail per board

---

### 🔎 Search & Filters
- Search tasks by title/description
- Filter by:
  - Assignee
  - Priority
  - Status
  - Deadline

---

### 📎 Attachments
- File uploads per task
- Cloud storage integration (e.g. Cloudinary / S3)

---

### 🔔 Notifications
- Task assignments
- New comments
- Due date reminders
- In-app notification center

---
