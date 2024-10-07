import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentsRepository: Repository<Tournament>,
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
}
