import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesSeeder } from './seed-roles';
import { UsersSeeder } from './seed-users';
import { TournamentsSeeder } from './seed-tournaments';
import { MatchesSeeder } from './seed-matches';
import { Seeder } from './index';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match } from '../matches/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Tournament, Match])],
  providers: [
    RolesSeeder,
    UsersSeeder,
    TournamentsSeeder,
    MatchesSeeder,
    Seeder,
  ],
  exports: [Seeder],
})
export class SeedersModule {}
