import { IsString, IsNotEmpty, IsInt, Min, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTournamentDto {
  @ApiProperty({ description: 'Tournament name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tournament Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Tournament start date',
    example: 'DD-MM-YYYY',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'Tournament end date',
    example: 'DD-MM-YYYY',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ description: 'Maximum number of participants', example: 16 })
  @IsInt()
  @Min(2)
  maxParticipants: number;
}
