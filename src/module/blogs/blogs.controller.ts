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
  UploadedFiles,
  UploadedFile,
  BadRequestException,
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
import { Blog, BlogDocument } from './entities/blogs.entity';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blogs.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
import { UserDocument } from '../admin/users/entities/user.entity';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
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
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const persianDate = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');
    const shortUrl = this.blogService.generateShortUrl();

    const preferredLanguage =
      createBlogDto.languages.find(
        (lang) => lang.language === 'en' || lang.language === 'fa',
      ) || createBlogDto.languages[0];

    if (!preferredLanguage || !preferredLanguage.title) {
      throw new BadRequestException('زبان و یا عنوان مناسبی وجود ندارد..');
    }

    const shortLink = `${preferredLanguage.title.split(' ').join('-')}-${shortUrl}`;
    const { id } = req.user as UserDocument;
    const newData = { ...createBlogDto, persianDate, authorId: id, shortLink };

    const result = await this.blogService.create(newData);
    return result;
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a specific blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully updated.',
    type: Blog,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiBody({ type: UpdateBlogDto })
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const result = await this.blogService.update(id, {...updateBlogDto, isShown: false });
    if (result.modifiedCount === 0) {
      return { success: false, message: 'Blog not found or nothing to update' };
    }
    return { success: true };
  }

  @Post('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
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
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
        ];

        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('پسوند فایل اشتباه است.'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // Set a file size limit
      },
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Uploaded file:', file);
    const filePath = `${file.path}`;
    return { success: true, path: filePath };
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
