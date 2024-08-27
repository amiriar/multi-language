import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UsersModule } from '../admin/users/users.module';
import { User, UserSchema } from '../admin/users/entities/user.entity';
import { Otp, OtpSchema } from 'src/module/otherEntities/Otp.entity';
import { RolesModule } from '../admin/users/roles/roles.module';
import { SmsService } from 'src/common/sms/sms.service';
import { HttpModule } from '@nestjs/axios';

dotenv.config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    RolesModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [AuthService, SmsService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
