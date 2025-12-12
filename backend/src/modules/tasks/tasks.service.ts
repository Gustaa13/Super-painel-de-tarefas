import { Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { CreateTaskDto } from "./dto/task/create-task.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { Task, TaskItem } from "@prisma/client";
import { CreateTaskItemDto } from "./dto/task-item/create-task-item.dto";
import { UpdateTaskDto } from "./dto/task/update-task.dto";
import { UpdateTaskItemDto } from "./dto/task-item/update-task-item.dto";

@Injectable()
export class TasksService {
    
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.prisma.task.create({
            data: {
                ...createTaskDto,
                userId: userId,
            },
        });
    }

    async findAll(userId: number, paginationDto: PaginationDto): Promise<Task[]> {
        const { page = 1, size = 10 } = paginationDto;
        const skip = (page - 1) * size;

        return await this.prisma.task.findMany({
            where: {userId: userId},
            skip: skip,
            take: size,
            orderBy: { id: 'asc' },
        })
    }

    async findById(userId: number, taskId: number): Promise<Task> {
        const task = await this.prisma.task.findFirst({
            where: { 
                id: taskId,
                userId: userId 
            },
        });

        if (!task) {
            throw new NotFoundException('Tarefa não encontrada.');
        }

        return task;
    }

    async update(userId: number, taskId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        await this.findById(userId, taskId);

        return await this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...updateTaskDto,
            },
        });
    }

    async remove(userId: number, taskId: number): Promise<Task> {
        await this.findById(userId, taskId);

        return await this.prisma.task.delete({
            where: { id: taskId },
        });
    }
    
    async createItem(userId: number, taskId: number, createTaskItemDto: CreateTaskItemDto): Promise<TaskItem> {
        await this.findById(userId, taskId);

        return await this.prisma.taskItem.create({
            data: {
                description: createTaskItemDto.description,
                check: createTaskItemDto.check, 
                taskId: taskId 
            }
        });
    }

    async findTaskItemById(userId: number, taskItemId: number): Promise<TaskItem> {
        const taskItem = await this.prisma.taskItem.findFirst({
            where: { 
                id: taskItemId,
                task: {
                    userId: userId
                }
            },
        });

        if(!taskItem) {
            throw new NotFoundException('Item de tarefa não encontrado.');
        }

        return taskItem;
    }

    async updateItem(userId: number, itemId: number, updateTaskItemDto: UpdateTaskItemDto): Promise<TaskItem> {
        await this.findTaskItemById(userId, itemId);

        return await this.prisma.taskItem.update({
            where: { id: itemId },
            data: updateTaskItemDto,
        })
    }

    async removeItem(userId: number, itemId: number): Promise<TaskItem> {
        await this.findTaskItemById(userId, itemId);

        return await this.prisma.taskItem.delete({
            where: { id: itemId },
        });
    }

}