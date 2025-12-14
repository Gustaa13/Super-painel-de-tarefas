export interface User {
  id: number;
  name: string;
  email: string;
  photoUrl?: string;
}

export interface UpdateUserDto {
  name: string;
  photoUrl?: string;
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

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum StatusFilter {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING'
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

export interface PaginationTaskDto extends PaginationDto {
  orderBy?: SortOrder;
  status?: StatusFilter;
  sortByPriority?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    page: number;
    size: number;
  };
}