import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('dashboard')
@UseGuards(AuthGuard)
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'update the user info' })
  @ApiResponse({ status: 200, description: 'User info updated.' })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', example: 'string' },
        email: { type: 'string', example: 'string' },
        password: { type: 'string', example: 'string' },
        firstname: { type: 'string', example: 'string' },
        lastname: { type: 'string', example: 'string' },
        job: { type: 'string', example: 'string' },
        linkedin: { type: 'string', example: 'string' },
        twitter: { type: 'string', example: 'string' },
        profile: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profile',{
    storage: diskStorage({
      destination: __dirname + '../../../uploads',  // Path where files will be saved
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
        cb(null, fileName);
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateDashboardDto.profile = file.path;
    }

    return await this.dashboardService.update(id, updateDashboardDto);
  }

  @Get('whoami')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get the user info' })
  @ApiResponse({ status: 200, description: 'User info.' })
  async whoami(@Req() req: Request) {
    const user = req?.user;

    return user;
  }
}
