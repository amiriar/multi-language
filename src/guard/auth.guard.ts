// src/auth/auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/module/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;
    
    if (!authorizationHeader) {
      throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید.');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.usersService.findOne(decodedToken.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach the user object to the request
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('jwt expired');
    }
  }
}
