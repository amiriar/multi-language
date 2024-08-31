import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
  ) {}
  async create(createBlogDto: CreateBlogDto) {
    return this.blogsModel.create(createBlogDto);
  }

  async findAll() {
    return this.blogsModel.find();
  }

  async findOne(id: string) {
    return this.blogsModel.findById(id);
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<any> {
    return this.blogsModel.updateOne({ _id: id }, { $set: updateBlogDto });
  }

  async remove(id: string) {
    return this.blogsModel.deleteOne({ id });
  }
}
