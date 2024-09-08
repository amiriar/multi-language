import { Injectable } from '@nestjs/common';
import { UpdateCatrgoryDto } from './dto/update-catrgory.dto';
import { CreateCategoryDto } from './dto/create-catrgory.dto';

@Injectable()
export class CatrgoriesService {
  create(createCatrgoryDto: CreateCategoryDto) {
    return 'This action adds a new catrgory';
  }

  findAll() {
    return `This action returns all catrgories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catrgory`;
  }

  update(id: number, updateCatrgoryDto: UpdateCatrgoryDto) {
    return `This action updates a #${id} catrgory`;
  }

  remove(id: number) {
    return `This action removes a #${id} catrgory`;
  }
}
