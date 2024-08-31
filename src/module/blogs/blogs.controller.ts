import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
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
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
import { UserDocument } from '../admin/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

dayjs.extend(jalaliday);

@ApiTags('blogs')
@Controller('blog')
@ApiBearerAuth()
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created.',
    type: Blog,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateBlogDto })
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const persianDate = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');
    const { id } = req.user as UserDocument;
    const newData = { ...createBlogDto, persianDate, authorId: id };
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

  @Patch(':id') // draft
  @UseGuards(AuthGuard)
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




  @Post(':id/upload') 
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload a specific item into blog by ID (draft)' })
  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully updated.',
    type: Blog,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiBody({ type: UpdateBlogDto })
  @UseInterceptors(
    FileInterceptor('blogFile', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const id = req.params.id;
          const uploadPath = __dirname + `../../../uploads/blogs/${id}`;

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'audio/mpeg', 'audio/wav', 'audio/mp3'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('پسوند فایل اشتباه است.'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    }),
  )
  @UseInterceptors(
    FileInterceptor('primary_image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const id = req.params.id;
          const uploadPath = __dirname + `../../../uploads/blogs/${id}`;

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('پسوند فایل اشتباه است.'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    }),
  )
  upload(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }




  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a specific blog by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The blog has been successfully deleted.',
  // })
  // @ApiResponse({ status: 404, description: 'Blog not found' })
  // remove(@Param('id') id: string) {
  //   return this.blogService.remove(id);
  // }
}
