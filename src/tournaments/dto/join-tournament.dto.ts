import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinTournamentDto {
  @ApiProperty({
    description: 'ID del usuario que se unirá al torneo',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
