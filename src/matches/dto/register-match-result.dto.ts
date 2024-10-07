import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMatchResultDto {
  @ApiProperty({
    description: 'ID del jugador que ganó el enfrentamiento',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  winnerId: number;

  @ApiProperty({ description: 'Puntuación del jugador 1', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  player1Score: number;

  @ApiProperty({ description: 'Puntuación del jugador 2', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  player2Score: number;
}
