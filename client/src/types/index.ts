export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER'
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string | null
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description?: string | null
  status: ProjectStatus
  ownerId: string
  owner: { id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
  _count?: { members: number; tasks: number }
  members?: ProjectMember[]
  tasks?: Task[]
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  joinedAt: string
  user: { id: string; name: string; email: string; role: Role }
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  projectId: string
  assigneeId?: string | null
  dueDate?: string | null
  doneAt?: string | null
  createdAt: string
  updatedAt: string
  assignee?: { id: string; name: string; email: string } | null
  project?: { id: string; name: string }
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  overdueCount: number
  tasksByStatus: { status: TaskStatus; count: number }[]
  tasksByPriority: { priority: Priority; count: number }[]
  recentActivity: Task[]
}

export interface Org {
  id: string
  name: string
  inviteCode: string
  createdAt: string
  _count?: { users: number }
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}