import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.tournamentsRepository.find({ relations: ['participants'] });
  }

  create(tournament: Tournament): Promise<Tournament> {
    return this.tournamentsRepository.save(tournament);
  }

  findOneById(id: number): Promise<Tournament> {
    return this.tournamentsRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.tournamentsRepository.delete(id);
  }

  async addPlayerToTournament(
    tournamentId: number,
    userId: number,
  ): Promise<Tournament> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['participants'],
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (
      !tournament.participants.some((participant) => participant.id === user.id)
    ) {
      tournament.participants.push(user);
      await this.tournamentsRepository.save(tournament);
    }

    return tournament;
  }

  async organizeMatches(tournamentId: number): Promise<Match[]> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['participants', 'matches'],
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    const shuffledPlayers = tournament.participants.sort(
      () => Math.random() - 0.5,
    );
    const matches: Match[] = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        const match = this.matchesRepository.create({
          tournament: tournament,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
        });
        matches.push(match);
      }
    }

    return this.matchesRepository.save(matches);
  }

  async getLeaderboard(tournamentId: number): Promise<any[]> {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['matches'],
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    const leaderboard = {};

    tournament.matches.forEach((match) => {
      if (match.winnerId) {
        leaderboard[match.winnerId] = (leaderboard[match.winnerId] || 0) + 1;
      }
    });

    const sortedLeaderboard = Object.entries(leaderboard).map(
      async ([userId, wins]) => {
        const user = await this.usersRepository.findOne({
          where: { id: Number(userId) },
        });
        return { user, wins };
      },
    );

    return Promise.all(sortedLeaderboard).then((result) =>
      result.sort((a, b) => Number(b.wins) - Number(a.wins)),
    );
  }
}
