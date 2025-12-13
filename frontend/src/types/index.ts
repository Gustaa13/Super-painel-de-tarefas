export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Task {
    id: number;
    title: string;
    priority: Priority;
    completed: boolean;
    checkList: TaskItem[];
}

export interface TaskItem {
    id: number;
    description: string;
    check: boolean;
}

export enum Priority {
    URGENT = 'URGENT',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export interface CreateTaskDto {
  title: string;
  priority: Priority;
}

export interface UpdateTaskDto {
  title?: string;
  priority?: Priority;
  completed?: boolean;
}

export interface CreateTaskItemDto {
  description: string;
}

export interface UpdateTaskItemDto {
  description?: string;
  check?: boolean;
}

export interface PaginationDto {
  page?: number;
  size?: number;
}