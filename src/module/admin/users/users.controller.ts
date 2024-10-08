import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  ConflictException,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as dayjs from 'dayjs';
import * as jalaliday from 'jalaliday';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
dayjs.extend(jalaliday);

@ApiTags('(Admin Panel) Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.', type: [User] })
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The found user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({
    schema: {
      properties: {
        phone: { type: 'string', example: '09102711050' },
      },
    },
  })
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findOneByPhone(createUserDto.phone);

    if (user) {
      throw new ConflictException('کاربر با این شماره تلفن از قبل وجود دارد.');
    }

    const madeIn = dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm');
    return await this.userService.createUser(createUserDto.phone, madeIn);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'update a new user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({
    schema: {
      properties: {
        phone: { type: 'string', example: '09102711050' },
      },
    },
  })
  @ApiBearerAuth()
  async update(
    @Param(':id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.findOneByPhone(updateUserDto.phone);

    if (!user) {
      throw new ConflictException('کاربر با این شماره تلفن وجود ندارد.');
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The found user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  async delete(@Param('id') id: string): Promise<User> {
    return await this.userService.deleteUser(id);
  }
}
