import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  create(@Body() role: Role) {
    return this.rolesService.create(role);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.rolesService.findOneByName(name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
