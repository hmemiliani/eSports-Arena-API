import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  create(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  findOneByName(name: string): Promise<Role> {
    return this.rolesRepository.findOneBy({ name });
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.softDelete(id);
  }
}
