import api from "@/lib/api";
import { 
  Task, 
  CreateTaskDto, 
  UpdateTaskDto, 
  CreateTaskItemDto, 
  UpdateTaskItemDto,
  PaginationDto
} from "@/types";

class TasksService {
 
  async findAll(pagination?: PaginationDto): Promise<Task[]> {
    const response = await api.get<Task[]>("/tasks", { params: pagination });
    return response.data;
  }

  async findById(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>("/tasks", data);
    return response.data;
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  async createItem(taskId: number, data: CreateTaskItemDto) {
    const response = await api.post(`/tasks/${taskId}/items`, data);
    return response.data;
  }

  async updateItem(itemId: number, data: UpdateTaskItemDto) {
    const response = await api.patch(`/tasks/items/${itemId}`, data);
    return response.data;
  }

  async deleteItem(itemId: number) {
    await api.delete(`/tasks/items/${itemId}`);
  }
}

export const tasksService = new TasksService();