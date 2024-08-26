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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as jalaliday from 'jalaliday';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';
import { TokenInterceptor } from 'src/interceptors/refreshToken.interceptor';
import { TokenMiddleware } from 'src/middleware/token.middleware';
import { request } from 'express';

dayjs.extend(jalaliday);

@ApiTags('blogs')
@Controller('blog')
// @UseInterceptors(TokenInterceptor)
@ApiBearerAuth()
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post()
  // @UseGuards(TokenMiddleware)
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created.',
    type: Blog,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateBlogDto })
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) { // Inject the request object using @Req()
    const persianDate = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');
    // @ts-ignore
    console.log(req.user); // Access req.user directly instead of global request
    
    // @ts-ignore
    const user = req.user._id; // Access user from req.user
    const newData = { ...createBlogDto, persianDate, authorId: user };
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
  @ApiBody({ type: UpdateBlogDto })
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
