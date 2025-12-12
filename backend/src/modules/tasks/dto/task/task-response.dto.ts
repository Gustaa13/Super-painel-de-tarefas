import { Priority, Task } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { TaskItemResponseDto } from "../task-item/task-item-response.dto";

@Exclude()
export class TaskResponseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    priority?: Priority;

    @Expose()
    completed?: boolean;

    @Expose()
    @Type(() => TaskItemResponseDto)
    checkList: TaskItemResponseDto[];

    constructor(task: Partial<Task>) {
        Object.assign(this, task);
    }
}