import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './entities/tournament.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tournaments')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplicar JwtAuthGuard y RolesGuard a todas las rutas
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Roles('Admin')
  @Post()
  create(@Body() tournament: Tournament) {
    return this.tournamentsService.create(tournament);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOneById(+id);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }

  @Roles('Player')
  @Post(':id/join')
  async joinTournament(@Param('id') tournamentId: string, @Request() req) {
    const userId = req.user.userId;
    return this.tournamentsService.addPlayerToTournament(+tournamentId, userId);
  }
}
