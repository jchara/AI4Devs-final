import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { RecentActivity } from './entities/recent-activity.entity';
import { ActivityRepository } from './repositories/activity.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RecentActivity])],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository],
  exports: [ActivityService, ActivityRepository, TypeOrmModule],
})
export class ActivityModule {}
