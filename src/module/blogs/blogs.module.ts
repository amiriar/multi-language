import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/entities/user.entity';
import { Role, RoleSchema } from 'src/otherEntities/role.entity';
import { Otp, OtpSchema } from 'src/otherEntities/Otp.entity';
import { BlogsController } from './blogs.controller';
import { Blog, BlogSchema } from './entities/blogs.entity';
import { BlogsService } from './blogs.service';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, AuthService, JwtService, UsersService],
})
export class BlogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(BlogsController);
  }
}