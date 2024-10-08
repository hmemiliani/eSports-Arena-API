import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matches/entities/match.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';

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

  async findAll(page: number, limit: number) {
    const [tournaments, total] = await this.tournamentsRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      total,
      page,
      limit,
      data: tournaments,
    };
  }

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const tournament = this.tournamentsRepository.create(createTournamentDto);
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

  async addPlayerToTournament(tournamentId: number, userId: number) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['users'],
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found.');
    }

    const isUserInTournament = tournament.users.some(
      (user) => user.id === userId,
    );
    if (isUserInTournament) {
      throw new BadRequestException(
        'The user is already registered for this tournament.',
      );
    }
    if (tournament.startDate >= tournament.endDate) {
      throw new BadRequestException(
        'The start date must be before the end date.',
      );
    }
    if (tournament.users.length >= tournament.maxParticipants) {
      throw new BadRequestException(
        'The tournament has reached the maximum number of participants.',
      );
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    tournament.users.push(user);
    await this.tournamentsRepository.save(tournament);

    return tournament;
  }

  async organizeMatches(tournamentId: number) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
      relations: ['users', 'matches'],
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found.');
    }
    if (tournament.matches.length > 0) {
      throw new BadRequestException('The matches have already been organized.');
    }
    const players = [...tournament.users];
    while (players.length > 1) {
      const player1 = players.splice(
        Math.floor(Math.random() * players.length),
        1,
      )[0];
      const player2 = players.splice(
        Math.floor(Math.random() * players.length),
        1,
      )[0];

      const match = this.matchesRepository.create({
        tournament,
        player1,
        player2,
      });
      await this.matchesRepository.save(match);
    }
    return tournament;
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
