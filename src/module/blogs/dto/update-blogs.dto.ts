import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto {
  @ApiProperty({ example: 'Updated Blog Title', description: 'Updated title of the blog', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Updated description...',
    description: 'Updated short description of the blog content',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '<p>Updated content goes here</p>',
    description: 'Updated main content of the blog',
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    example: 'https://example.com/updated-image.jpg',
    description: 'Updated image for the blog',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: ['nestjs', 'backend', 'update'],
    description: 'Updated tags related to the blog',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: 7,
    description: 'Updated estimated time to read in minutes',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  timeToRead?: number;

  @ApiProperty({
    example: 'https://short.link/updated',
    description: 'Updated short link for the blog',
    required: false,
  })
  @IsOptional()
  @IsString()
  shortLink?: string;

  @ApiProperty({
    example: '60f9c6b95b2e1c6a4b3c9d24',
    description: 'ID of the updated author (User)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  authorId?: string;
}