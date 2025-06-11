export interface DevelopmentMetrics {
  total: number;
  byStatus: {
    completed: number;
    inDevelopment: number;
    cancelled: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byEnvironment: { [key: string]: number };
}
