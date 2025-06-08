export interface DevelopmentMetrics {
  total: number;
  byStatus: {
    completed: number;
    inProgress: number;
    planning: number;
    testing: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
} 