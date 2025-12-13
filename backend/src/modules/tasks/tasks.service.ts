import { Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { CreateTaskDto } from "./dto/task/create-task.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, Task, TaskItem } from "@prisma/client";
import { CreateTaskItemDto } from "./dto/task-item/create-task-item.dto";
import { UpdateTaskDto } from "./dto/task/update-task.dto";
import { UpdateTaskItemDto } from "./dto/task-item/update-task-item.dto";
import { PaginatedOutput } from "../../common/paginatedOutput";
import { PaginationTaskDto, SortOrder, StatusFilter } from "./dto/task/pagination-task.dto";

@Injectable()
export class TasksService {
    
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.prisma.task.create({
            data: {
                ...createTaskDto,
                userId: userId
            },
        });
    }

    async findAll(userId: number, paginationDto: PaginationTaskDto): Promise<PaginatedOutput<Task>> {
        const page = Number(paginationDto.page) || 1;
        const size = Number(paginationDto.size) || 10;
        const skip = (page - 1) * size;
        
        const idOrder: Prisma.SortOrder = paginationDto.orderBy?.toUpperCase() === 'ASC' ? 'asc' : 'desc';

        const where: Prisma.TaskWhereInput = {
            userId: userId, 
        };

        if (paginationDto.status === 'COMPLETED') {
            where.completed = true;
        } else if (paginationDto.status === 'PENDING') {
            where.completed = false;
        }

        const orderBy: Prisma.TaskOrderByWithRelationInput[] = [];

        if (paginationDto.sortByPriority) {
            orderBy.push({ priority: 'asc' }); 
        }

        orderBy.push({ id: idOrder });

        const [total, tasks] = await Promise.all([
            this.prisma.task.count({ where }),
            
            this.prisma.task.findMany({
                where,
                skip,
                take: size,
                orderBy, 
                include: {
                    checkList: {
                        orderBy: { id: 'asc' }
                    }
                }
            })
        ]);

        const lastPage = Math.ceil(total / size);

        return {
            data: tasks,
            meta: {
                total,
                lastPage,
                page,
                size
            }
        };
    }

    async findById(userId: number, taskId: number): Promise<Task> {
        const task = await this.prisma.task.findFirst({
            where: { 
                id: taskId,
                userId: userId
            },
            include: {
                checkList: {
                    orderBy: { id: 'asc' }
                }
            }
        });

        if (!task) {
            throw new NotFoundException('Tarefa não encontrada.');
        }

        return task;
    }

    async update(userId: number, taskId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        await this.findById(userId, taskId);

        if (updateTaskDto.completed !== undefined) {
            
            return await this.prisma.$transaction(async (tx) => {
                
                const task = await tx.task.update({
                    where: { id: taskId },
                    data: updateTaskDto,
                });

                await tx.taskItem.updateMany({
                    where: { taskId: taskId },
                    data: { 
                        check: updateTaskDto.completed 
                    }
                });

                return task;
            });
        }

        return this.prisma.task.update({
            where: { id: taskId },
            data: updateTaskDto,
        });
    }

    async remove(userId: number, taskId: number): Promise<Task> {
        await this.findById(userId, taskId);

        return await this.prisma.task.delete({
            where: { id: taskId }
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
            data: updateTaskItemDto
        })
    }

    async removeItem(userId: number, itemId: number): Promise<TaskItem> {
        await this.findTaskItemById(userId, itemId);

        return await this.prisma.taskItem.delete({
            where: { id: itemId }
        });
    }

}