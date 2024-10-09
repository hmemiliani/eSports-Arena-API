import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
  ) {}

  async getMatchesByTournament(tournamentId: number): Promise<Match[]> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['matches'],
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    return tournament.matches;
  }

  async registerMatchResult(
    matchId: number,
    player1Score: number,
    player2Score: number,
  ): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    match.player1Score = player1Score;
    match.player2Score = player2Score;

    if (player1Score > player2Score) {
      match.winnerId = match.player1.id;
    } else if (player2Score > player1Score) {
      match.winnerId = match.player2.id;
    } else {
      match.winnerId = null;
    }

    return this.matchesRepository.save(match);
  }
}
