import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';
import * as crypto from 'crypto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
  ) {}
  async create(createBlogDto: CreateBlogDto) {
    return this.blogsModel.create(createBlogDto);
  }

  generateShortUrl(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  async findAll() {
    const data = await this.blogsModel.find();
    if(data.length > 0) {
      return data
    }else{
      throw new NotFoundException("بلاگی یافت نشد..")
    }
  }

  async findOne(id: string) {
    const data = await this.blogsModel.find({ shortLink: id })
    if(data.length > 0) {
      return data
    }else{
      throw new NotFoundException("بلاگی با این نام یافت نشد..")
    }
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<any> {
    return this.blogsModel.updateOne({ shortLink: id }, { $set: updateBlogDto });
  }

  async remove(id: string) {
    return this.blogsModel.deleteOne({ shortLink: id });
  }
}
