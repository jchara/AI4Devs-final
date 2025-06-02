import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';

// Nuevos módulos de dominio
import { IdentityModule } from './modules/identity/identity.module';
import { ProjectManagementModule } from './modules/project-management/project-management.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';

// Módulo pendiente de reorganización
import { ActivityModule } from './modules/activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    
    // Módulos de dominio reorganizados
    IdentityModule,
    ProjectManagementModule,
    InfrastructureModule,
    
    // Módulos pendientes de reorganización
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
