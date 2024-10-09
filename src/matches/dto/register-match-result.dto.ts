import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterMatchResultDto {
  @ApiProperty({ description: 'Player 1 score', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  player1Score: number;

  @ApiProperty({ description: 'Player 2 score', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  player2Score: number;
}
