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
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '../entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con email único y contraseña hasheada'
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'Datos del usuario a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Juan Pérez González' },
        email: { type: 'string', example: 'juan.perez@empresa.com' },
        roleId: { type: 'number', example: 1 },
        teamId: { type: 'number', example: 2 },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error de validación en los datos enviados' })
  @ApiResponse({ status: 409, description: 'El email ya existe en el sistema' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Retorna una lista completa de todos los usuarios del sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Juan Pérez González' },
          email: { type: 'string', example: 'juan.perez@empresa.com' },
          roleId: { type: 'number', example: 1 },
          teamId: { type: 'number', example: 2 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ 
    summary: 'Obtener estadísticas de usuarios',
    description: 'Retorna métricas agregadas de usuarios: total, activos, distribución por roles y equipos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', example: 25 },
        activeUsers: { type: 'number', example: 23 },
        usersByRole: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              roleName: { type: 'string', example: 'Desarrollador' },
              count: { type: 'number', example: 15 }
            }
          }
        },
        usersByTeam: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              teamName: { type: 'string', example: 'Backend' },
              count: { type: 'number', example: 8 }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  getUserStatistics() {
    return this.userService.getUserStatistics();
  }

  @Get('by-role/:roleId')
  @ApiOperation({ 
    summary: 'Obtener usuarios por rol',
    description: 'Retorna todos los usuarios que pertenecen a un rol específico'
  })
  @ApiParam({ 
    name: 'roleId', 
    type: Number, 
    description: 'ID del rol a filtrar',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios por rol obtenida exitosamente',
    type: [User]
  })
  @ApiResponse({ status: 400, description: 'ID de rol inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<User[]> {
    return this.userService.findByRole(roleId);
  }

  @Get('by-team/:teamId')
  @ApiOperation({ 
    summary: 'Obtener usuarios por equipo',
    description: 'Retorna todos los usuarios que pertenecen a un equipo específico'
  })
  @ApiParam({ 
    name: 'teamId', 
    type: Number, 
    description: 'ID del equipo a filtrar',
    example: 2
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios por equipo obtenida exitosamente',
    type: [User]
  })
  @ApiResponse({ status: 400, description: 'ID de equipo inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByTeam(@Param('teamId', ParseIntPipe) teamId: number): Promise<User[]> {
    return this.userService.findByTeam(teamId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Retorna los detalles completos de un usuario específico'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del usuario',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Juan Pérez González' },
        email: { type: 'string', example: 'juan.perez@empresa.com' },
        roleId: { type: 'number', example: 1 },
        teamId: { type: 'number', example: 2 },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'ID inválido proporcionado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualiza los datos de un usuario existente. Si se actualiza el email, se verifica que no exista'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del usuario a actualizar',
    example: 1
  })
  @ApiBody({ 
    type: UpdateUserDto,
    description: 'Datos a actualizar del usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Juan Pérez González - Actualizado' },
        email: { type: 'string', example: 'juan.perez.updated@empresa.com' },
        roleId: { type: 'number', example: 2 },
        teamId: { type: 'number', example: 1 },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
  @ApiResponse({ status: 409, description: 'El nuevo email ya existe en el sistema' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema de forma permanente'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID del usuario a eliminar',
    example: 1
  })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'ID inválido proporcionado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
} 