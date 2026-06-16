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
  description?: string
  position: number
  columnId: string
}

export interface Column {
  id: string
  title: string
  position: number
  tasks: Task[]
}

export interface Workspace {
  id: string
  name: string
  columns: Column[]
}
