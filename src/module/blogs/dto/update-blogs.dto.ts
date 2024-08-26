import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateBlogDto } from './create-blogs.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsOptional()
  @IsMongoId()
  id?: string; 
}
