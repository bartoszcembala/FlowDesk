export interface LoginFormInputs {
  email: string
  password: string
}

export interface SignUpFormInputs {
  username: string
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  description?: string
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}
export interface WorkspaceMember {
  id: string
  userId: string
  workspaceId: string
  role: "OWNER" | "MEMBER"

  createdAt: string

  user: {
    id: string
    username: string
    email: string
    avatar: string | null
  }
}

export interface Workspace {
  id: string
  userId: string
  name: string
  columns: Column[]
  createdAt: string
  updatedAt: string
  members: WorkspaceMember[]
}
