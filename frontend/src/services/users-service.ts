import api from "@/lib/api";
import { UpdateUserDto, User } from "@/types";

class UsersService {

    async update(data: UpdateUserDto): Promise<User> {
        const response = await api.patch<User>(`/users`, data);
        return response.data;
    }
}

export const usersService = new UsersService();
