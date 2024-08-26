import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/module/auth/auth.service';
import { UsersService } from 'src/module/users/users.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const cookies = request.headers?.cookie?.split(';') || [];    
    const accessTokenCookie = cookies.find((cookie: string) =>
      cookie.trim().startsWith('accessToken='),
    );
    const accessToken = accessTokenCookie
      ? accessTokenCookie.split('=')[1]
      : null;

    if (!accessToken) {
      throw new UnauthorizedException('لطفا وارد حساب کاربری خود شوید.');
    }

    try {
      const decodedToken = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });

      this.usersService.findOne(decodedToken.id).then((res) => {
        request.user = res;
        return next.handle(); // Token is valid, proceed with the request
      }).catch((err) => {
        console.log(err);
      });
      
    } catch (err) {
      
      if (err.name === 'TokenExpiredError') {
        // Token expired, refresh the access token
        const decodedToken = this.jwtService.decode(accessToken) as {
          id: string;
        };
        
        const userId = decodedToken?.id;

        if (!userId) {
          throw new UnauthorizedException('Invalid token structure.');
        }

        
        
        return from(this.usersService.findOne(userId)).pipe(
          switchMap((user) => {
            if (!user || !user.refreshToken) {
              throw new UnauthorizedException(
                'Refresh token not found in database.',
              );
            }
            
            return from(this.authService.refreshTokens(user.refreshToken)).pipe(
              switchMap(({ accessToken }) => {
                console.log(accessToken);
                
                response.cookie('accessToken', accessToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production" ? true : false, // Set to true if your app is served over HTTPS
                  // maxAge: 30 * 60 * 1000, // 30 minutes
                  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
                });

                // Update the request headers with the new access token
                request.headers.cookie = `accessToken=${accessToken}`;

                const user = this.usersService.findOne(decodedToken.id);
                request.user = user;
                

                return next.handle();
              }),
            );
          }),
          catchError((err) => {
            console.log(err);
            return throwError(() => new UnauthorizedException('Unauthorized'));
          }),
        );
      } else {
        
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}
