import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Player or Admin',
    description: 'The name of the role',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
