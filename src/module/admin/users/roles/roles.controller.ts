import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/module/otherEntities/role.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('roles')
@UseGuards(AuthGuard)
@ApiTags('(Admin Panel) Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved roles',
    type: Role,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiBearerAuth()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved role',
    type: Role,
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: "Change a user's role" })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ schema: { type: 'string', description: 'New Role ID' } })
  @ApiResponse({ status: 200, description: 'Role changed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'User or Role not found' })
  @ApiBearerAuth()
  async changeRole(@Param('id') userId: string, @Body() newRoleId: string) {
    return await this.rolesService.changeRole(userId, newRoleId);
  }
}
