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

  @ApiOperation({ summary: 'Get all the matches of a tournament' })
  @ApiParam({ name: 'tournamentId', description: 'Tournament ID' })
  @ApiResponse({
    status: 200,
    description: 'List of matches obtained successfully.',
  })
  @Get('tournament/:tournamentId')
  async getMatchesByTournament(@Param('tournamentId') tournamentId: string) {
    return this.matchesService.getMatchesByTournament(+tournamentId);
  }

  @ApiOperation({ summary: 'Record the outcome of a match' })
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({
    status: 200,
    description: 'Result registered successfully.',
  })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  @Roles('Admin')
  @Post(':id/register-result')
  async registerMatchResult(
    @Param('id') matchId: string,
    @Body() registerMatchResultDto: RegisterMatchResultDto,
  ) {
    const { player1Score, player2Score } = registerMatchResultDto;
    return this.matchesService.registerMatchResult(
      +matchId,
      player1Score,
      player2Score,
    );
  }
}
