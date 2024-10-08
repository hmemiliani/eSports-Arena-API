import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RegisterMatchResultDto } from './dto/register-match-result.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Obtener todos los enfrentamientos de un torneo' })
  @ApiParam({ name: 'tournamentId', description: 'ID del torneo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de enfrentamientos obtenida correctamente.',
  })
  @Get('tournament/:tournamentId')
  async getMatchesByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.getMatchesByTournament(+tournamentId);
  }

  @ApiOperation({ summary: 'Registrar el resultado de un enfrentamiento' })
  @ApiParam({ name: 'id', description: 'ID del enfrentamiento' })
  @ApiResponse({
    status: 200,
    description: 'Resultado registrado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Enfrentamiento no encontrado.' })
  @Roles('Admin')
  @Post(':id/register-result')
  async registerMatchResult(
    @Param('id') matchId: string,
    @Body() registerMatchResultDto: RegisterMatchResultDto,
  ) {
    const { winnerId, player1Score, player2Score } = registerMatchResultDto;
    return this.matchesService.registerMatchResult(
      +matchId,
      winnerId,
      player1Score,
      player2Score,
    );
  }
}
