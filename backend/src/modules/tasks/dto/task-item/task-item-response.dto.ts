import { TaskItem } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TaskItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  check: boolean;

  constructor(taskItem: Partial<TaskItem>) {
    Object.assign(this, taskItem);
  }
}