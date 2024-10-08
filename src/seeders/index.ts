import { Injectable } from '@nestjs/common';
import { RolesSeeder } from './seed-roles';
import { UsersSeeder } from './seed-users';
import { TournamentsSeeder } from './seed-tournaments';
import { MatchesSeeder } from './seed-matches';

@Injectable()
export class Seeder {
  constructor(
    private readonly rolesSeeder: RolesSeeder,
    private readonly usersSeeder: UsersSeeder,
    private readonly tournamentsSeeder: TournamentsSeeder,
    private readonly matchesSeeder: MatchesSeeder,
  ) {}

  async seed() {
    await this.rolesSeeder.seed();
    await this.usersSeeder.seed();
    await this.tournamentsSeeder.seed();
    await this.matchesSeeder.seed();
  }
}
