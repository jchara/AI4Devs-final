import { PartialType } from '@nestjs/swagger';
import { CreateDevelopmentComponentDto } from './create-development-component.dto';

export class UpdateDevelopmentComponentDto extends PartialType(CreateDevelopmentComponentDto) {} 