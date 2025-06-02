import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }
} 