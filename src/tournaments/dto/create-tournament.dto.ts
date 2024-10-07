import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({ description: 'Nombre del torneo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción del torneo' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Fecha de inicio del torneo',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de finalización del torneo',
    example: '2024-01-10',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
