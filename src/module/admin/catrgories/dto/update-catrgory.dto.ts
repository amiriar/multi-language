import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-catrgory.dto';

export class UpdateCatrgoryDto extends PartialType(CreateCategoryDto) {}
