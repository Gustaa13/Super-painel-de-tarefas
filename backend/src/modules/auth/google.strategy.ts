import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20'; 
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',     
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', 
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    } as StrategyOptions); 
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = await this.authService.validateOAuthLogin(profile);
    
    if(!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    return user;
  }
}