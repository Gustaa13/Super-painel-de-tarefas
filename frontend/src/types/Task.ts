import { Priority } from "./Priority";
import { TaskItem } from "./TaskItem";

export interface Task {
    id: number;
    title: string;
    priority: Priority;
    completed: boolean;
    checkList: TaskItem[];
}