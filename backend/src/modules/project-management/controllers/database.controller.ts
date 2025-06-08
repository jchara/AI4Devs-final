import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../services/database.service';
import { BaseController } from './base.controller';
import { Database } from '../entities/database.entity';
import { CreateDatabaseDto } from '../dtos/database.dto';
import { UpdateDatabaseDto } from '../dtos/database.dto';
import { DatabaseType } from '../../../shared/enums/database-type.enum';

@ApiTags('databases')
@Controller('databases')
export class DatabaseController extends BaseController<Database> {
  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new database' })
  @ApiResponse({ status: 201, description: 'Database created successfully' })
  create(@Body() createDatabaseDto: CreateDatabaseDto): Promise<Database> {
    return this.databaseService.create(createDatabaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all databases' })
  @ApiResponse({ status: 200, description: 'Return all databases' })
  findAll(): Promise<Database[]> {
    return this.databaseService.findAll();
  }

  @Get('environment/:environmentId')
  @ApiOperation({ summary: 'Get databases by environment' })
  @ApiResponse({ status: 200, description: 'Return databases by environment' })
  findByEnvironmentId(@Param('environmentId') environmentId: string) {
    return this.databaseService.findByEnvironmentId(+environmentId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get databases by type' })
  @ApiResponse({ status: 200, description: 'Return databases by type' })
  findByType(@Param('type') type: DatabaseType): Promise<Database[]> {
    return this.databaseService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get database by id' })
  @ApiResponse({ status: 200, description: 'Return database by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Database> {
    return this.databaseService.findOne(id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get database with details' })
  @ApiResponse({ status: 200, description: 'Return database with details' })
  getDatabaseWithDetails(@Param('id') id: string) {
    return this.databaseService.getDatabaseWithDetails(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update database' })
  @ApiResponse({ status: 200, description: 'Database updated successfully' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDatabaseDto: UpdateDatabaseDto): Promise<Database> {
    return this.databaseService.update(id, updateDatabaseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete database' })
  @ApiResponse({ status: 204, description: 'Database deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.databaseService.delete(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore deleted database' })
  @ApiResponse({ status: 200, description: 'Database restored successfully' })
  restore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.databaseService.restore(id);
  }
} 