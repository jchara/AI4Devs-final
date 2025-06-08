import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateTeamDto extends BaseDto {
  @ApiProperty({ description: 'Nombre del equipo' })
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción del equipo' })
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  description: string;
}

export class UpdateTeamDto extends BaseDto {
  @ApiProperty({ description: 'Nombre del equipo', required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Descripción del equipo', required: false })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  description?: string;
}

export class TeamResponseDto extends BaseDto {
  id: number;
  name: string;
  description: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
} 