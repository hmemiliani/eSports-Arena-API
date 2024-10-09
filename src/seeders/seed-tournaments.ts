import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Injectable()
export class TournamentsSeeder {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async seed() {
    const tournaments = [
      {
        name: 'Champions League',
        description: 'The biggest football tournament in Europe.',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31'),
        maxParticipants: 16,
      },
    ];

    for (const tournament of tournaments) {
      const existingTournament = await this.tournamentRepository.findOne({
        where: { name: tournament.name },
      });
      if (!existingTournament) {
        await this.tournamentRepository.save(
          this.tournamentRepository.create(tournament),
        );
      }
    }
  }
}
