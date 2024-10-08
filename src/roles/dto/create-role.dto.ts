import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'The name of the role' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
