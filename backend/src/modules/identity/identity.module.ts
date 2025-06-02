import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Role, Team } from './entities';
import { UserRepository, RoleRepository, TeamRepository } from './repositories';
import { UserController } from './controllers';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Team])],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository, TeamRepository],
  exports: [UserService, UserRepository, RoleRepository, TeamRepository, TypeOrmModule],
})
export class IdentityModule {} 