import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/entities/user.entity';
import { Role, RoleDocument } from 'src/otherEntities/role.entity';
import { UsersService } from '../users/users.service';
import * as dotenv from 'dotenv';
import { Otp, OtpDocument } from 'src/otherEntities/Otp.entity';
import { request } from 'express';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async validateUser(
    phone: string,
    code: string,
    lastDateIn: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ phoneNumber: phone });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (new Date() > user.otpExpiresAt) {
      throw new UnauthorizedException('OTP has expired.');
    }

    if (user.otp === code) {
      user.lastDateIn = lastDateIn;
      user.otp = null;
      user.otpExpiresAt = null;
      return user.save();
    } else {
      throw new UnauthorizedException('Invalid OTP.');
    }
  }

  async signTokens(user: UserDocument) {
    const payload = { id: user._id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h', // Access token expiration
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: '7d', // Refresh token expiration
    });

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }
  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<UserDocument> {
    const user = request.user as UserDocument;
    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات پیدا نشد.');
    }

    const compare = await bcrypt.compare(newPassword, oldPassword);
    if (compare) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      user.password = hash;
      await user.save();
    }

    return user;
  }

  async clearRefreshToken(userId: string) {
    return await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
      });

      const user = await this.usersService.findOne(decoded.id) as UserDocument;

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  // OTP

  generateOtp(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  async saveOtp(userId: string, otp: string): Promise<Otp> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 2); // Set OTP expiration to 2 minutes

    const newOtp = new this.otpModel({
      otp,
      user: user._id,
      expiresAt: expirationTime,
    });

    user.otp = otp;
    user.otpExpiresAt = expirationTime;

    await user.save();

    return newOtp.save();
  }

  async sendOtpToPhone(phone: string, otp: string): Promise<void> {
    // Send OTP to the phone number using an SMS service
    // Implement SMS service integration here
  }
}
