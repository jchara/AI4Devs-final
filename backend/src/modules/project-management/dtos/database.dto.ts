import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, Length, IsNumber, IsBoolean } from 'class-validator';
import { BaseDto } from './base.dto';
import { DatabaseType } from '../../../shared/enums/database-type.enum';

export class CreateDatabaseDto {
  @ApiProperty({ description: 'Name of the database' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Description of the database' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: DatabaseType, description: 'Type of the database' })
  @IsEnum(DatabaseType)
  type: DatabaseType;

  @ApiProperty({ description: 'Version of the database' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Whether the database is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'ID of the project this database belongs to' })
  @IsNumber()
  projectId: number;

  @ApiProperty({ description: 'ID of the environment this database belongs to' })
  @IsNumber()
  @IsOptional()
  environmentId?: number;
}

export class UpdateDatabaseDto {
  @ApiProperty({ description: 'Name of the database', required: false })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the database', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: DatabaseType, description: 'Type of the database', required: false })
  @IsEnum(DatabaseType)
  @IsOptional()
  type?: DatabaseType;

  @ApiProperty({ description: 'Version of the database', required: false })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Whether the database is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'ID of the project this database belongs to', required: false })
  @IsNumber()
  @IsOptional()
  projectId?: number;

  @ApiProperty({ description: 'ID of the environment this database belongs to', required: false })
  @IsNumber()
  @IsOptional()
  environmentId?: number;
}

export class DatabaseResponseDto extends BaseDto {
  id: number;
  name: string;
  type: DatabaseType;
  description?: string;
  environmentId: number;
} 