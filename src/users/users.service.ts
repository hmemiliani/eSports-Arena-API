import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
