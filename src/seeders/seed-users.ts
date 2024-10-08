import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });
    const playerRole = await this.roleRepository.findOne({
      where: { name: 'Player' },
    });

    const users = [
      {
        username: 'admin',
        password: await bcrypt.hash('password', 10),
        roles: [adminRole],
      },
      {
        username: 'player1',
        password: await bcrypt.hash('password', 10),
        roles: [playerRole],
      },
      {
        username: 'player2',
        password: await bcrypt.hash('password', 10),
        roles: [playerRole],
      },
      {
        username: 'player3',
        password: await bcrypt.hash('password', 10),
        roles: [playerRole],
      },
    ];

    for (const user of users) {
      const existingUser = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (!existingUser) {
        await this.userRepository.save(this.userRepository.create(user));
      }
    }
  }
}
