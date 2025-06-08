export interface RecentActivityMetadata {
  oldValue?: string | number | boolean | null;
  newValue?: string | number | boolean | null;
  componentId?: number;
  databaseId?: number;
  deploymentId?: number;
  status?: string;
  priority?: string;
  progress?: number;
  [key: string]: unknown;
} 