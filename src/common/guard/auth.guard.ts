import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "src/module/admin/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;
    
    // Skip token validation for logout route
    const url = request.url;
    if (url.includes('/logout')) {
      return true; // Allow access to logout even if the token is expired
    }

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
      // Handle token expiration
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('jwt expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
