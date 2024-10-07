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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JoinTournamentDto } from './dto/join-tournament.dto';
import { CreateTournamentDto } from './dto/create-tournament.dto';

@Controller('tournaments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Roles('Admin')
  @Post()
  async create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
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
    const joinTournamentDto = new JoinTournamentDto();
    joinTournamentDto.userId = userId;
    return this.tournamentsService.addPlayerToTournament(+tournamentId, userId);
  }

  @Roles('Admin')
  @Post(':id/organize-matches')
  async organizeMatches(@Param('id') tournamentId: string) {
    return this.tournamentsService.organizeMatches(+tournamentId);
  }

  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') tournamentId: string) {
    return this.tournamentsService.getLeaderboard(+tournamentId);
  }
}
