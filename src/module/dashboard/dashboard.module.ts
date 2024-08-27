import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../admin/users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../admin/users/users.service';
import { Otp, OtpSchema } from '../otherEntities/Otp.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, JwtModule, JwtService, UsersService],
})
export class DashboardModule {}
