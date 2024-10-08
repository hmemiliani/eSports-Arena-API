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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tournaments') // Agrupa las rutas bajo la categoría "Tournaments"
@ApiBearerAuth() // Indica que las rutas requieren autenticación JWT
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiOperation({ summary: 'Obtener todos los torneos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de torneos obtenida correctamente.',
  })
  @Get()
  findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return this.tournamentsService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Crear un nuevo torneo' })
  @ApiResponse({ status: 201, description: 'Torneo creado correctamente.' })
  @Roles('Admin')
  @Post()
  async create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @ApiOperation({ summary: 'Obtener detalles de un torneo' })
  @ApiParam({ name: 'id', description: 'ID del torneo' })
  @ApiResponse({
    status: 200,
    description: 'Detalles del torneo obtenidos correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOneById(+id);
  }

  @ApiOperation({ summary: 'Eliminar un torneo' })
  @ApiParam({ name: 'id', description: 'ID del torneo' })
  @ApiResponse({ status: 200, description: 'Torneo eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado.' })
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }

  @ApiOperation({ summary: 'Unirse a un torneo' })
  @ApiParam({ name: 'id', description: 'ID del torneo' })
  @ApiResponse({
    status: 200,
    description: 'Usuario unido al torneo correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Torneo o usuario no encontrado.' })
  @Roles('Player')
  @Post(':id/join')
  async joinTournament(@Param('id') tournamentId: string, @Request() req) {
    const userId = req.user.userId;
    const joinTournamentDto = new JoinTournamentDto();
    joinTournamentDto.userId = userId;
    return this.tournamentsService.addPlayerToTournament(+tournamentId, userId);
  }

  @ApiOperation({ summary: 'Organizar enfrentamientos en un torneo' })
  @ApiParam({ name: 'id', description: 'ID del torneo' })
  @ApiResponse({
    status: 200,
    description: 'Enfrentamientos organizados correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado.' })
  @Roles('Admin')
  @Post(':id/organize-matches')
  async organizeMatches(@Param('id') tournamentId: string) {
    return this.tournamentsService.organizeMatches(+tournamentId);
  }

  @ApiOperation({ summary: 'Obtener la clasificación del torneo' })
  @ApiParam({ name: 'id', description: 'ID del torneo' })
  @ApiResponse({
    status: 200,
    description: 'Clasificación del torneo obtenida correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Torneo no encontrado.' })
  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') tournamentId: string) {
    return this.tournamentsService.getLeaderboard(+tournamentId);
  }
}
