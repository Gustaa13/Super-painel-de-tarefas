import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);

        if(!user || !user.password) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            const { password, ...result} = user;
    
            return result as User;
        }

        return null;
    }

    async validateOAuthLogin(profile: any): Promise<User> {
        const { emails, name, photos } = profile;
        const email = emails[0].value;

        let user = await this.usersService.findByEmail(email);

        if(!user) {
            user = await this.usersService.create({
                email,
                name: `${name.givenName} ${name.familyName}`,
                password: '',
                photoUrl: photos[0].value
            })
        }

        return user;
    }

    login(user: User) {
        const payload = { email: user.email, sub: user.id };
        
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);

        const { access_token } = this.login(user);

        const { password, ...result } = user;

        return {
            access_token,
            result 
        }
    }

    async getProfile(userId: number): Promise<User> {
        return await this.usersService.findById(userId);
    }
}
