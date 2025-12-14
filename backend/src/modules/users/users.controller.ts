import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dto/user-response.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.usersService.create(createUserDto);

        return new UserResponseDto(newUser);
    }

    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        const users = await this.usersService.findAll(paginationDto);

        return users.map(user => new UserResponseDto(user));
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findById(id);

        return new UserResponseDto(user);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const updatedUser = await this.usersService.update(id, updateUserDto);

        return new UserResponseDto(updatedUser);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const deletedUser = await this.usersService.remove(id);

        return new UserResponseDto(deletedUser);
    }
}