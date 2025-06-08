import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComponentService } from '../services/component.service';
import { BaseController } from './base.controller';
import { Component } from '../entities/component.entity';
import { CreateComponentDto } from '../dtos/component.dto';
import { UpdateComponentDto } from '../dtos/component.dto';
import { ComponentType } from '../../../shared/enums';

@ApiTags('components')
@Controller('components')
export class ComponentController extends BaseController<Component> {
  constructor(private readonly componentService: ComponentService) {
    super(componentService);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new component' })
  @ApiResponse({ status: 201, description: 'Component created successfully' })
  create(@Body() createComponentDto: CreateComponentDto): Promise<Component> {
    return this.componentService.create(createComponentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all components' })
  @ApiResponse({ status: 200, description: 'Return all components' })
  findAll(): Promise<Component[]> {
    return this.componentService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get components by project' })
  @ApiResponse({ status: 200, description: 'Return components by project' })
  findByProjectId(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Component[]> {
    return this.componentService.findByProject(projectId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get components by type' })
  @ApiResponse({ status: 200, description: 'Return components by type' })
  findByType(@Param('type') type: ComponentType): Promise<Component[]> {
    return this.componentService.findByType(type);
  }

  @Get('version/:version')
  @ApiOperation({ summary: 'Get components by version' })
  @ApiResponse({ status: 200, description: 'Return components by version' })
  findByVersion(@Param('version') version: string): Promise<Component[]> {
    return this.componentService.findByVersion(version);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active components' })
  @ApiResponse({ status: 200, description: 'Return active components' })
  findActive(): Promise<Component[]> {
    return this.componentService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get component by id' })
  @ApiResponse({ status: 200, description: 'Return component by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Component> {
    return this.componentService.findOne(id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get component with details' })
  @ApiResponse({ status: 200, description: 'Return component with details' })
  getComponentWithDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Component> {
    return this.componentService.getComponentWithDetails(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update component' })
  @ApiResponse({ status: 200, description: 'Component updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComponentDto: UpdateComponentDto,
  ): Promise<Component> {
    return this.componentService.update(id, updateComponentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete component' })
  @ApiResponse({ status: 204, description: 'Component deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.componentService.delete(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore deleted component' })
  @ApiResponse({ status: 200, description: 'Component restored successfully' })
  restore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.componentService.restore(id);
  }
}
