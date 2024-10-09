import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async create(createUserDto: CreateUserDto, isAdmin: boolean): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new BadRequestException('The user already exists.');
    }

    const roleName = createUserDto.role || (isAdmin ? 'Admin' : 'Player');

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw new BadRequestException(`The role ${roleName} does not exist.`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    return this.usersRepository.save(newUser);
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    await this.usersRepository.softDelete(id);
  }
}
