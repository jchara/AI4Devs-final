import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DatabaseChangeType } from '../../../shared/enums';
import { CreateDevelopmentDatabaseDto } from '../dto/create-development-database.dto';
import { UpdateDevelopmentDatabaseDto } from '../dto/update-development-database.dto';
import { DevelopmentDatabase } from '../entities/development-database.entity';
import { DevelopmentDatabaseService } from '../services/development-database.service';

@ApiTags('development-databases')
@Controller('development-databases')
export class DevelopmentDatabaseController {
  constructor(
    private readonly developmentDatabaseService: DevelopmentDatabaseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new development database' })
  @ApiResponse({
    status: 201,
    description: 'Development database created successfully',
  })
  create(
    @Body() createDto: CreateDevelopmentDatabaseDto,
  ): Promise<DevelopmentDatabase> {
    return this.developmentDatabaseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all development databases' })
  @ApiResponse({ status: 200, description: 'Return all development databases' })
  findAll(): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get development database by id' })
  @ApiResponse({
    status: 200,
    description: 'Return development database by id',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DevelopmentDatabase> {
    return this.developmentDatabaseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update development database' })
  @ApiResponse({
    status: 200,
    description: 'Development database updated successfully',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDevelopmentDatabaseDto,
  ): Promise<DevelopmentDatabase> {
    return this.developmentDatabaseService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete development database' })
  @ApiResponse({
    status: 204,
    description: 'Development database deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.developmentDatabaseService.delete(id);
  }

  @Get('development/:developmentId')
  @ApiOperation({ summary: 'Get development databases by development id' })
  @ApiResponse({
    status: 200,
    description: 'Return development databases by development id',
  })
  findByDevelopment(
    @Param('developmentId', ParseIntPipe) developmentId: number,
  ): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseService.findDatabasesByDevelopment(
      developmentId,
    );
  }

  @Get('database/:databaseId')
  @ApiOperation({ summary: 'Get development databases by database id' })
  @ApiResponse({
    status: 200,
    description: 'Return development databases by database id',
  })
  findByDatabase(
    @Param('databaseId', ParseIntPipe) databaseId: number,
  ): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseService.findDatabasesByDatabase(databaseId);
  }

  @Get('change-type/:changeType')
  @ApiOperation({ summary: 'Get development databases by change type' })
  @ApiResponse({
    status: 200,
    description: 'Return development databases by change type',
  })
  findByChangeType(
    @Param('changeType') changeType: DatabaseChangeType,
  ): Promise<DevelopmentDatabase[]> {
    return this.developmentDatabaseService.findByChangeType(changeType);
  }
}
