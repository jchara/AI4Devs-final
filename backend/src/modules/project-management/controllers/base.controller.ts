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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ObjectLiteral } from 'typeorm';
import { BaseService } from '../services/base.service';

@Controller()
export abstract class BaseController<T extends ObjectLiteral> {
  constructor(protected readonly service: BaseService<T>) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 201, description: 'Entity created successfully' })
  create(@Body() createDto: Partial<T>): Promise<T> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: 200, description: 'Return all entities' })
  findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by id' })
  @ApiResponse({ status: 200, description: 'Return entity by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update entity' })
  @ApiResponse({ status: 200, description: 'Entity updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<T>,
  ): Promise<T> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete entity' })
  @ApiResponse({ status: 204, description: 'Entity deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore deleted entity' })
  @ApiResponse({ status: 200, description: 'Entity restored successfully' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restore(id);
  }
}
