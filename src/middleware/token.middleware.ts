import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/module/auth/auth.service';
import { UsersService } from 'src/module/users/users.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const cookies = req.headers?.cookie?.split(';') || [];
      const accessTokenCookie = cookies.find((cookie: string) =>
        cookie.trim().startsWith('accessToken='),
      );
      const accessToken = accessTokenCookie
        ? accessTokenCookie.split('=')[1]
        : null;

      if (!accessToken) {
        throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید.');
      }

      // Validate and decode the access token
      const decodedToken = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });

      // Retrieve user based on the token
      const user = await this.usersService.findOne(decodedToken.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to the request object
      req.user = user;

      // Proceed to the next middleware or controller
      next();

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle token expiration case
        const cookies = req.headers?.cookie?.split(';') || [];
        const accessTokenCookie = cookies.find((cookie: string) =>
          cookie.trim().startsWith('accessToken='),
        );
        const accessToken = accessTokenCookie
          ? accessTokenCookie.split('=')[1]
          : null;

        const decodedToken = this.jwtService.decode(accessToken) as { id: string };
        const userId = decodedToken?.id;
        
        if (!userId) {
          throw new UnauthorizedException('Invalid token structure.');
        }

        try {
          const user = await this.usersService.findOne(userId);
          if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Refresh token not found in database.');
          }

          // Refresh the access token
          const { accessToken: newAccessToken } = await this.authService.refreshTokens(user.refreshToken);

          // Set new access token as a cookie
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false, // Set to true if your app is served over HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
          });

          // Update the request headers with the new access token
          req.headers.cookie = `accessToken=${newAccessToken}`;

          // Attach user to the request object
          req.user = user;
          next();

        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          throw new UnauthorizedException('Unauthorized');
        }

      } else {
        console.error('Token verification error:', err);
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}
