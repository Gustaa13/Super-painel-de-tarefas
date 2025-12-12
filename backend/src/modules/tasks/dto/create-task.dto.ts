import { Priority } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateTaskItemDto } from "./create-task-item.dto";
import { Type } from "class-transformer";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(Priority, { message: "Prioridade inválida" })
    @IsOptional()
    priority?: Priority;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateTaskItemDto)
    checkList?: CreateTaskItemDto[];
}