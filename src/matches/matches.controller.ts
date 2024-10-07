import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RegisterMatchResultDto } from './dto/register-match-result.dto';

@Controller('matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('tournament/:tournamentId')
  async getMatchesByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.getMatchesByTournament(+tournamentId);
  }

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
