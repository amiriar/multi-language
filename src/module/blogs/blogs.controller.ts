import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as jalaliday from 'jalaliday';
import { request } from 'express';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';

dayjs.extend(jalaliday);

@ApiTags('blogs')
@Controller('blog')
@ApiBearerAuth()
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created.',
    type: Blog,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBlogDto: CreateBlogDto) {
    const persianDate = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');
    // @ts-ignore
    const user = request.user.id;
    const newData = { ...createBlogDto, persianDate, user };
    return this.blogService.create(newData);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all blogs' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved blogs.',
    type: [Blog],
  })
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the blog.',
    type: Blog,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully updated.',
    type: Blog,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
