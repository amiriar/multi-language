import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsMongoId, ArrayNotEmpty, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsNotEmpty()
  body: string;  // Assuming the body is in string format (e.g., HTML or Markdown)

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  timeToRead?: number;

  @IsOptional()
  @IsString()
  shortLink?: string;

  @IsMongoId()
  @IsNotEmpty()
  authorId: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  relatedPosts?: string[];
}
