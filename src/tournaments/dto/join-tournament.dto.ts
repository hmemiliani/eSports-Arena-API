import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinTournamentDto {
  @ApiProperty({
    description: 'ID of the user who will join the tournament',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
