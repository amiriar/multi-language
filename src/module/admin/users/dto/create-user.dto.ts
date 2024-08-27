import { IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  phone: string;
}
