import { User } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}