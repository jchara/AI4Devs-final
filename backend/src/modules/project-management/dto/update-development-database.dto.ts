import { PartialType } from '@nestjs/swagger';
import { CreateDevelopmentDatabaseDto } from './create-development-database.dto';

export class UpdateDevelopmentDatabaseDto extends PartialType(CreateDevelopmentDatabaseDto) {} 