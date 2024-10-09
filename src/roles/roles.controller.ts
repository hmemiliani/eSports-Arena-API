import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of roles obtained successfully.',
  })
  @Roles('Admin')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiBody({ type: CreateRoleDto })
  @Roles('Admin')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    const role = new Role();
    role.name = createRoleDto.name;
    return this.rolesService.create(role);
  }

  @ApiOperation({ summary: 'Get a role by name' })
  @ApiParam({ name: 'name', description: 'Role Name' })
  @ApiResponse({ status: 200, description: 'Role found successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @Roles('Admin')
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.rolesService.findOneByName(name);
  }

  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @Roles('Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
