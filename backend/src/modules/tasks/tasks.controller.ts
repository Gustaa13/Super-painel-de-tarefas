import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Headers, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CreateTaskDto } from "./dto/task/create-task.dto";
import { TasksService } from "./tasks.service";
import { UsersService } from "../users/users.service";
import { CreateTaskItemDto } from "./dto/task-item/create-task-item.dto";
import { TaskItemResponseDto } from "./dto/task-item/task-item-response.dto";
import { TaskResponseDto } from "./dto/task/task-response.dto";
import { UpdateTaskDto } from "./dto/task/update-task.dto";
import { UpdateTaskItemDto } from "./dto/task-item/update-task-item.dto";
import { PaginationTaskDto } from "./dto/task/pagination-task.dto";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {

    constructor(private readonly tasksService: TasksService, private readonly userService: UsersService) {}

    @Post()
    async create(
        @CurrentUser() user: any,
        @Body() createTaskDto: CreateTaskDto
    ) {
        const userId = user.userId;
        const newTask = await this.tasksService.create(userId, createTaskDto);

        return new TaskResponseDto(newTask);
    }

    @Get()
    async findAll(
        @CurrentUser() user: any,
        @Query() paginationDto: PaginationTaskDto
    ) {
        const userId = user.userId;
        const result = await this.tasksService.findAll(userId, paginationDto);

        return {
            data: result.data.map(task => new TaskResponseDto(task)),
            meta: result.meta
        };
    }

    @Get(':id')
    async findById(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) id: number
    ) {
        const userId = user.userId;
        const task = await this.tasksService.findById(userId, id);

        return new TaskResponseDto(task);
    }

    @Patch(':id')
    async update(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        const userId = user.userId;
        const updatedTask = await this.tasksService.update(userId, id, updateTaskDto);

        return new TaskResponseDto(updatedTask);
    }

    @Delete(':id')
    async remove(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) id: number
    ) {
        const userId = user.userId;
        const deletedUser = await this.tasksService.remove(userId, id);

        return new TaskResponseDto(deletedUser);
    }

    @Post(':id/items')
    async createItem(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) taskId: number,
        @Body() createTaskItemDto: CreateTaskItemDto
    ) {
        const userId = user.userId;
        const newTaskItem = await this.tasksService.createItem(userId, taskId, createTaskItemDto);

        return new TaskItemResponseDto(newTaskItem);
    }

    @Patch('/items/:itemId')
    async updateItem(
        @CurrentUser() user: any,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() updateTaskItemDto: UpdateTaskItemDto
    ) {
        const userId = user.userId;
        const newTaskItem = await this.tasksService.updateItem(userId, itemId, updateTaskItemDto);

        return new TaskItemResponseDto(newTaskItem);
    }

    @Delete('/items/:itemId')
    async removeItem(
        @CurrentUser() user: any,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        const userId = user.userId;
        const newTaskItem = await this.tasksService.removeItem(userId, itemId);

        return new TaskItemResponseDto(newTaskItem);
    }
}