import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatrgoriesService } from './catrgories.service';
import { CreateCategoryDto } from './dto/create-catrgory.dto';
import { UpdateCatrgoryDto } from './dto/update-catrgory.dto';

@Controller('catrgories')
export class CatrgoriesController {
  constructor(private readonly catrgoriesService: CatrgoriesService) {}

  @Post()
  create(@Body() createCatrgoryDto: CreateCategoryDto) {
    return this.catrgoriesService.create(createCatrgoryDto);
  }

  @Get()
  findAll() {
    return this.catrgoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catrgoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatrgoryDto: UpdateCatrgoryDto) {
    return this.catrgoriesService.update(+id, updateCatrgoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catrgoriesService.remove(+id);
  }
}
