import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogsModel: Model<BlogDocument>) {}
  create(createBlogDto: CreateBlogDto) {
    return this.blogsModel.create(createBlogDto);
  }

  findAll() {
    return this.blogsModel.find();
  }

  findOne(id: string) {
    return this.blogsModel.findById(id);
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogsModel.updateOne({ id, $set: updateBlogDto });
  }

  remove(id: string) {
    return this.blogsModel.deleteOne({ id });
  }
}
