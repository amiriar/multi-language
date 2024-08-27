import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  BadRequestException,
  Req,
  Get,
  UseInterceptors,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as jalaliday from 'jalaliday';
import { UsersService } from '../admin/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../admin/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SmsService } from 'src/common/sms/sms.service';

dotenv.config();
dayjs.extend(jalaliday);

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly SmsService: SmsService,
  ) {}

  @Post('send-otp')
  @HttpCode(201)
  @ApiOperation({ summary: "Send OTP to user's phone" })
  @ApiBody({
    schema: {
      properties: {
        phone: {
          type: 'string',
          example: '09102711050',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Phone number is required.' })
  async sendOTP(@Body('phone') phone: string) {
    if (!phone) {
      throw new BadRequestException('شماره تلفن مورد نیاز است.');
    }
    const madeIn = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');
    let user = await this.userService.findOneByPhone(phone);

    if (!user) {
      user = await this.userService.createUser(phone, madeIn);
    }
    if (new Date() < user.otpExpiresAt) {
      throw new ForbiddenException('هنوز کد قبلی شما منقضی نشده است.');
    }

    const otp = this.authService.generateOtp();
    // @ts-ignore
    await this.authService.saveOtp(user._id, otp);

    await this.SmsService.sendSMS(phone, otp);

    return {
      message: 'OTP با موفقیت ارسال شد.',
      otp,
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login with phone and OTP' })
  @ApiBody({
    schema: {
      properties: {
        phone: { type: 'string', example: '09102711050' },
        code: { type: 'string', example: '12345' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid OTP or phone number.' })
  async login(
    @Body('phone') phone: string,
    @Body('code') code: string,
    @Res() res: Response,
  ) {
    try {
      const lastDateIn = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');

      // Validate user credentials
      const user = await this.authService.validateUser(phone, code, lastDateIn);

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Invalid OTP or phone number.' });
      }

      // Generate access and refresh tokens
      const { accessToken, refreshToken } =
        await this.authService.signTokens(user);

      // Set access token in httpOnly cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are secure in production
        // sameSite: 'strict',
      });

      // Send success response
      res.status(200).json({ message: 'Login successful', refreshToken });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: 'Invalid OTP or phone number.' });
    }
  }

  @Post('logout')
  // @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout the user' })
  // @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  async logout(@Res() res: Response, @Req() req: Request) {
    res.clearCookie('accessToken');
    res.send({ message: 'Logout successful' });
  }

  @Post('change-pass')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      properties: {
        oldPassword: { type: 'string', example: 'oldPass123' },
        newPassword: { type: 'string', example: 'newPass456' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(oldPassword, newPassword);
  }

  @Post('refresh-token')
  // @UseGuards(AuthGuard)
  @Post('change-pass')
  @HttpCode(200)
  @ApiOperation({ summary: 'makes accessToken based on refresh token' })
  // @ApiBearerAuth()
  @ApiBody({
    schema: {
      properties: {
        refreshToken: { type: 'string', example: '' },
      },
    },
  })
  async refreshToken(
    @Res() res: Response,
    @Body('refreshToken') refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { accessToken } = await this.authService.refreshTokens(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
    });
    return res.status(200).json({ message: 'کوکی جدید ست شد' });
  }

}
