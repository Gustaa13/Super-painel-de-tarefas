import { Priority } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(Priority, { message: "Prioridade inválida" })
    @IsOptional()
    priority?: Priority;
}