import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { User } from "@prisma/client";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
    }

    async findAll(paginationDto: PaginationDto): Promise<User[]> {
        const { page = 1, size = 10 } = paginationDto;

        const skip = (page - 1) * size;

        return await this.prisma.user.findMany({
            skip: skip,
            take: size,
            orderBy: { id: 'asc' },
        });
    }

    async findById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if(!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.findById(id);

        let dataToUpDate = { ...updateUserDto };

        if(dataToUpDate.password) {
            dataToUpDate.password = await bcrypt.hash(dataToUpDate.password, 10);
        }

        return await this.prisma.user.update({
            where: { id },
            data: dataToUpDate,
        });
    }

    async remove(id: number): Promise<User> {
        await this.findById(id);

        return await this.prisma.user.delete({
            where: { id },
        });
    }

}