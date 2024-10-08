import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../matches/entities/match.entity';
import { User } from '../users/entities/user.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Injectable()
export class MatchesSeeder {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async seed() {
    const tournament = await this.tournamentRepository.findOne({
      where: { name: 'Champions League' },
    });

    const players = await this.userRepository.find({
      where: { role: { name: 'Player' } },
    });

    if (tournament && players.length >= 2) {
      const existingMatch = await this.matchRepository.findOne({
        where: { tournament: { id: tournament.id } },
      });

      if (!existingMatch) {
        const match = this.matchRepository.create({
          tournament,
          player1: players[0],
          player2: players[1],
        });
        await this.matchRepository.save(match);
      }
    }
  }
}
