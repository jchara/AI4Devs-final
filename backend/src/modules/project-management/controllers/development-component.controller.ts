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
import { DevelopmentComponentChangeType } from '../../../shared/enums/development-component-change-type.enum';
import {
  CreateDevelopmentComponentDto,
  UpdateDevelopmentComponentDto,
} from '../dtos/development-component.dto';
import { DevelopmentComponent } from '../entities/development-component.entity';
import { DevelopmentComponentService } from '../services/development-component.service';

@ApiTags('development-components')
@Controller('development-components')
export class DevelopmentComponentController {
  constructor(
    private readonly developmentComponentService: DevelopmentComponentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new development component' })
  @ApiResponse({
    status: 201,
    description: 'Development component created successfully',
  })
  create(
    @Body() createDto: CreateDevelopmentComponentDto,
  ): Promise<DevelopmentComponent> {
    return this.developmentComponentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all development components' })
  @ApiResponse({
    status: 200,
    description: 'Return all development components',
  })
  findAll(): Promise<DevelopmentComponent[]> {
    return this.developmentComponentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get development component by id' })
  @ApiResponse({
    status: 200,
    description: 'Return development component by id',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DevelopmentComponent> {
    return this.developmentComponentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update development component' })
  @ApiResponse({
    status: 200,
    description: 'Development component updated successfully',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDevelopmentComponentDto,
  ): Promise<DevelopmentComponent> {
    return this.developmentComponentService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete development component' })
  @ApiResponse({
    status: 204,
    description: 'Development component deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.developmentComponentService.delete(id);
  }

  @Get('development/:developmentId')
  @ApiOperation({ summary: 'Get development components by development id' })
  @ApiResponse({
    status: 200,
    description: 'Return development components by development id',
  })
  findByDevelopment(
    @Param('developmentId', ParseIntPipe) developmentId: number,
  ): Promise<DevelopmentComponent[]> {
    return this.developmentComponentService.findByDevelopment(developmentId);
  }

  @Get('component/:componentId')
  @ApiOperation({ summary: 'Get development components by component id' })
  @ApiResponse({
    status: 200,
    description: 'Return development components by component id',
  })
  findByComponent(
    @Param('componentId', ParseIntPipe) componentId: number,
  ): Promise<DevelopmentComponent[]> {
    return this.developmentComponentService.findByComponent(componentId);
  }

  @Get('change-type/:changeType')
  @ApiOperation({ summary: 'Get development components by change type' })
  @ApiResponse({
    status: 200,
    description: 'Return development components by change type',
  })
  findByChangeType(
    @Param('changeType') changeType: DevelopmentComponentChangeType,
  ): Promise<DevelopmentComponent[]> {
    return this.developmentComponentService.findByChangeType(changeType);
  }
}
