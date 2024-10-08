import { IsString, IsNotEmpty, IsInt, Min, IsDate } from 'class-validator';
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
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de finalización del torneo',
    example: '2024-01-10',
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Maximum number of participants', example: 16 })
  @IsInt()
  @Min(2)
  maxParticipants: number;
}
