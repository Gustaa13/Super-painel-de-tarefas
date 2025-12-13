import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Headers, UnauthorizedException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/task/create-task.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { TasksService } from "./tasks.service";
import { UsersService } from "../users/users.service";
import { CreateTaskItemDto } from "./dto/task-item/create-task-item.dto";
import { TaskItemResponseDto } from "./dto/task-item/task-item-response.dto";
import { TaskResponseDto } from "./dto/task/task-response.dto";
import { UpdateTaskDto } from "./dto/task/update-task.dto";
import { UpdateTaskItemDto } from "./dto/task-item/update-task-item.dto";
import { PaginationTaskDto } from "./dto/task/pagination-task.dto";

@Controller('tasks')
export class TasksController {

    constructor(private readonly tasksService: TasksService, private readonly userService: UsersService) {}

    private async getUserIdFromHeader(authHeader: string): Promise<number> {
        if (!authHeader) {
            throw new UnauthorizedException('Header "x-user-id" é obrigatório por enquanto');
        }

        const userId = parseInt(authHeader, 10);

        await this.userService.findById(userId);

        return userId;
    }

    @Post()
    async create(
        @Headers('x-user-id') userIdHeader: string,
        @Body() createTaskDto: CreateTaskDto
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const newTask = await this.tasksService.create(userId, createTaskDto);

        return new TaskResponseDto(newTask);
    }

    @Get()
    async findAll(
        @Headers('x-user-id') userIdHeader: string,
        @Query() paginationDto: PaginationTaskDto
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const result = await this.tasksService.findAll(userId, paginationDto);

        return {
            data: result.data.map(task => new TaskResponseDto(task)),
            meta: result.meta
        };
    }

    @Get(':id')
    async findById(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id', ParseIntPipe) id: number
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const task = await this.tasksService.findById(userId, id);

        return new TaskResponseDto(task);
    }

    @Patch(':id')
    async update(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const updatedTask = await this.tasksService.update(userId, id, updateTaskDto);

        return new TaskResponseDto(updatedTask);
    }

    @Delete(':id')
    async remove(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id', ParseIntPipe) id: number
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const deletedUser = await this.tasksService.remove(userId, id);

        return new TaskResponseDto(deletedUser);
    }

    @Post(':id/items')
    async createItem(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id', ParseIntPipe) taskId: number,
        @Body() createTaskItemDto: CreateTaskItemDto
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const newTaskItem = await this.tasksService.createItem(userId, taskId, createTaskItemDto);

        return new TaskItemResponseDto(newTaskItem);
    }

    @Patch('/items/:itemId')
    async updateItem(
        @Headers('x-user-id') userIdHeader: string,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() updateTaskItemDto: UpdateTaskItemDto
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const newTaskItem = await this.tasksService.updateItem(userId, itemId, updateTaskItemDto);

        return new TaskItemResponseDto(newTaskItem);
    }

    @Delete('/items/:itemId')
    async removeItem(
        @Headers('x-user-id') userIdHeader: string,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        const userId = await this.getUserIdFromHeader(userIdHeader);
        const newTaskItem = await this.tasksService.removeItem(userId, itemId);

        return new TaskItemResponseDto(newTaskItem);
    }
}