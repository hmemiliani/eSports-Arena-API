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

    if (!adminRole || !playerRole) {
      throw new Error(
        'Roles "Admin" and "Player" must exist before seeding users.',
      );
    }

    const users = [
      {
        username: 'admin',
        password: await bcrypt.hash('password', 10),
        role: adminRole,
      },
      {
        username: 'player1',
        password: await bcrypt.hash('password', 10),
        role: playerRole,
      },
      {
        username: 'player2',
        password: await bcrypt.hash('password', 10),
        role: playerRole,
      },
      {
        username: 'player3',
        password: await bcrypt.hash('password', 10),
        role: playerRole,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: { username: userData.username },
      });

      if (!existingUser) {
        const newUser = this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        console.log(`User ${userData.username} created successfully.`);
      } else {
        console.log(`User ${userData.username} already exists.`);
      }
    }
  }
}
