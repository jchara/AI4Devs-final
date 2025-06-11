import { ApiProperty } from '@nestjs/swagger';
import { DevelopmentStatus } from '../../../shared/enums/development-status.enum';
import { DevelopmentPriority } from '../../../shared/enums/development-priority.enum';

export class DevelopmentMetricsResponseDto {
  @ApiProperty({ description: 'Total number of developments' })
  total: number;

  @ApiProperty({ description: 'Total number of developments' })
  totalDevelopments: number;

  @ApiProperty({ description: 'Average progress of all developments' })
  averageProgress: number;

  @ApiProperty({ description: 'Number of developments completed this month' })
  completedThisMonth: number;

  @ApiProperty({ description: 'Number of overdue developments' })
  overdue: number;

  @ApiProperty({ description: 'Number of developments by status' })
  byStatus: Record<DevelopmentStatus, number>;

  @ApiProperty({ description: 'Number of developments by priority' })
  byPriority: Record<DevelopmentPriority, number>;

  @ApiProperty({ description: 'Number of developments by environment' })
  byEnvironment: Record<string, number>;
} 