import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'A Great Blog Title', description: 'The title of the blog' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A short description of the blog...',
    description: 'A short description of the blog content',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: '<p>Blog content goes here</p>', description: 'The main content of the blog' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'An optional image for the blog',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: ['nestjs', 'backend'], description: 'Tags related to the blog' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 5, description: 'Estimated time to read in minutes' })
  @IsOptional()
  @IsNumber()
  timeToRead?: number;

  @ApiProperty({
    example: 'https://short.link/example',
    description: 'A short link for the blog',
  })
  @IsOptional()
  @IsString()
  shortLink?: string;

  @ApiProperty({
    example: '60f9c6b95b2e1c6a4b3c9d24',
    description: 'ID of the author (User)',
  })
  @IsMongoId()
  authorId: string;

  @IsOptional()
  @IsBoolean()
  isShown?: boolean;

}