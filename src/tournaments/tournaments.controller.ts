import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './entities/tournament.entity';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Post()
  create(@Body() tournament: Tournament) {
    return this.tournamentsService.create(tournament);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOneById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
