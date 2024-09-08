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

export class CreateBlogDto {
  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'An optional image for the blog' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: [
      {
        language: 'en',
        title: 'A Great Blog Title in English',
        description: 'A short description of the blog content in a specific language',
        body: '<p>Blog content goes here in a specific language</p>',
        isShown: true,
      },
    ],
    description: 'Array of language-specific content',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  languages: LanguageDto[];

  @ApiProperty({
    example: ['60f9c6b95b2e1c6a4b3c9d24'],
    description: 'Array of user IDs who liked the blog',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  likes?: string[];

  @ApiProperty({
    example: ['60f9c6b95b2e1c6a4b3c9d25'],
    description: 'Array of comment IDs related to the blog',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  comments?: string[];

  @ApiProperty({
    example: 'https://short.link/example',
    description: 'A short link for the blog',
  })
  @IsOptional()
  @IsString()
  shortLink?: string;

  @IsOptional()
  @IsMongoId()
  category?: string; // Use string here for validation, MongoDB will handle it as ObjectId  

  @ApiProperty({
    example: '60f9c6b95b2e1c6a4b3c9d24',
    description: 'ID of the author (User)',
  })
  @IsMongoId()
  authorId: string;

  @ApiProperty({ example: true, description: 'Whether the blog is shown publicly' })
  @IsOptional()
  @IsBoolean()
  isShown?: boolean;
}
