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
import { JoinTournamentDto } from './dto/join-tournament.dto';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tournaments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiOperation({ summary: 'Get all tournaments' })
  @ApiResponse({
    status: 200,
    description: 'Tournament list obtained successfully.',
  })
  @Get()
  findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return this.tournamentsService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Create a new tournament' })
  @ApiResponse({ status: 201, description: 'Tournament created successfully.' })
  @Post()
  async create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @ApiOperation({ summary: 'Get details of a tournament' })
  @ApiParam({ name: 'id', description: 'Tournament ID' })
  @ApiResponse({
    status: 200,
    description: 'Tournament details obtained successfully.',
  })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOneById(+id);
  }

  @ApiOperation({ summary: 'Delete a tournament' })
  @ApiParam({ name: 'id', description: 'Tournament ID' })
  @ApiResponse({ status: 200, description: 'Tournament successfully removed.' })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.tournamentsService.remove(+id);
      return {
        statusCode: 200,
        message: 'Tournament successfully removed.',
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Join a tournament' })
  @ApiParam({ name: 'id', description: 'Tournament ID' })
  @ApiResponse({
    status: 200,
    description: 'User joined the tournament successfully.',
  })
  @ApiResponse({ status: 404, description: 'Tournament or user not found.' })
  @Post(':id/join')
  async joinTournament(@Param('id') tournamentId: string, @Request() req) {
    const userId = req.user.userId;
    const joinTournamentDto = new JoinTournamentDto();
    joinTournamentDto.userId = userId;
    return this.tournamentsService.addPlayerToTournament(+tournamentId, userId);
  }

  @ApiOperation({ summary: 'Organizing matches in a tournament' })
  @ApiParam({ name: 'id', description: 'Tournament ID' })
  @ApiResponse({
    status: 200,
    description: 'Matches organized correctly.',
  })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  @Post(':id/organize-matches')
  async organizeMatches(@Param('id') tournamentId: string) {
    return this.tournamentsService.organizeMatches(+tournamentId);
  }

  @ApiOperation({ summary: 'Get the tournament ranking' })
  @ApiParam({ name: 'id', description: 'Tournament ID' })
  @ApiResponse({
    status: 200,
    description: 'Tournament ranking obtained successfully.',
  })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') tournamentId: string) {
    return this.tournamentsService.getLeaderboard(+tournamentId);
  }
}
