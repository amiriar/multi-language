import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
  MaxLength,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @IsBoolean()
  isShown?: boolean;

  @ApiProperty({
    example: '60f9c6b95b2e1c6a4b3c9d24',
    description: 'ID of the updated author (User)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  authorId?: string;
}

class LanguageDto {
  @ApiProperty({ example: 'en', description: 'Language code' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'A Great Blog Title in English', description: 'Title in specific language' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A short description of the blog content in a specific language',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: '<p>Blog content goes here in a specific language</p>', description: 'Body in a specific language' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ example: true, description: 'Visibility of the blog in the given language' })
  @IsOptional()
  @IsBoolean()
  isShown?: boolean;
}


export class UpdateBlogLanguagesDto {
  @ApiProperty({ type: [LanguageDto], description: 'New languages to be added or updated' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  languages: LanguageDto[];
}