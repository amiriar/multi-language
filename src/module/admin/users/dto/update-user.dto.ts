import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsAlphanumeric()
  @MinLength(3, { message: 'نام کاربری نمیتواند کمتر از 3 کاراکتر باشد' })
  @MinLength(20, { message: 'نام کاربری نمیتواند بیشتر از 20 کاراکتر' })
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsPhoneNumber('IR', { message: 'شماره تلفن صحیح نمیباشد.' })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  profile: string;

  @IsOptional()
  @IsString()
  role: string;
}
