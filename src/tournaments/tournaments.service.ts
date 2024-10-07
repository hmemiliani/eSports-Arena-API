import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
}
