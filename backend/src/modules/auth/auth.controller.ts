import { Controller, Get, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = this.authService.login(req.user);
    
    res.cookie('Authentication', access_token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      maxAge: 24 * 60 * 60 * 1000 
    });

    return { message: 'Login realizado com sucesso', user: req.user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { access_token } = this.authService.login(req.user);
    
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.redirect('http://localhost:3000/task-board'); 
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    return { message: 'Logout realizado' };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { access_token, result } = await this.authService.register(createUserDto);

    res.cookie('Authentication', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    });

    return { 
        message: 'Cadastro realizado com sucesso', 
        user: result
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@CurrentUser() currentUser: any) {
    const user = await this.authService.getProfile(currentUser.userId);

    return new UserResponseDto(user);
  }
}