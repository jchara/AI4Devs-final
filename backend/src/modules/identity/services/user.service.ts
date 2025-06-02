import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hashear password
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const userData: Partial<User> = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.userRepository.create(userData);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByRole(roleId: number): Promise<User[]> {
    return this.userRepository.findByRole(roleId);
  }

  async findByTeam(teamId: number): Promise<User[]> {
    return this.userRepository.findByTeam(teamId);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se está actualizando el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    // Si se está actualizando la password, hashearla
    const updateData = { ...updateUserDto } as Partial<User>;
    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    }

    return this.userRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Verificar que existe
    await this.userRepository.remove(id);
  }

  async getUserStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Array<{ roleName: string; count: number }>;
    usersByTeam: Array<{ teamName: string; count: number }>;
  }> {
    const allUsers = await this.userRepository.findAll();
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((user) => user.isActive).length;

    // Agrupar por roles
    const roleGroups: Record<string, number> = allUsers.reduce(
      (acc, user) => {
        const roleName = user.role?.name || 'Sin rol';
        acc[roleName] = (acc[roleName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const usersByRole = Object.entries(roleGroups).map(([roleName, count]) => ({
      roleName,
      count,
    }));

    // Agrupar por equipos
    const teamGroups: Record<string, number> = allUsers.reduce(
      (acc, user) => {
        const teamName = user.team?.name || 'Sin equipo';
        acc[teamName] = (acc[teamName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const usersByTeam = Object.entries(teamGroups).map(([teamName, count]) => ({
      teamName,
      count,
    }));

    return {
      totalUsers,
      activeUsers,
      usersByRole,
      usersByTeam,
    };
  }
}
