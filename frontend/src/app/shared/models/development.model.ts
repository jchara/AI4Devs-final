import { User, Team } from './user.model';

export enum DevelopmentStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DevelopmentEnvironment {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export enum ComponentType {
  MICROSERVICE = 'MICROSERVICE',
  MICROFRONTEND = 'MICROFRONTEND',
  MONOLITH = 'MONOLITH',
}

export enum ActivityType {
  DEVELOPMENT_CREATED = 'development_created',
  DEVELOPMENT_UPDATED = 'development_updated',
  STATUS_CHANGED = 'status_changed',
  MICROSERVICE_ADDED = 'microservice_added',
  MICROSERVICE_REMOVED = 'microservice_removed',
  PROGRESS_UPDATED = 'progress_updated',
  DEPLOYMENT_SCHEDULED = 'deployment_scheduled',
}

export enum DeploymentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Component {
  id: number;
  name: string;
  type: ComponentType;
  technology: string;
  version: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecentActivity {
  id: number;
  type: ActivityType;
  description: string;
  user: User;
  timestamp: Date;
  createdAt: Date;
  developmentId: number;
  isActive: boolean;
}

export interface DeploymentType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpcomingDeployment {
  id: number;
  title: string;
  environment: DevelopmentEnvironment;
  scheduledDate: Date;
  status: DeploymentStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deployedBy: User;
  deploymentType: DeploymentType;
}

export interface DevelopmentComponent {
  id: number;
  component: Component;
  changeType: string;
  progress: number;
  notes: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Development {
  id: number;
  title: string;
  description: string;
  status: DevelopmentStatus;
  priority: string;
  environment: DevelopmentEnvironment;
  environmentId?: number;
  projectId?: number;
  progress: number;
  isActive: boolean;
  jiraUrl?: string;
  branch?: string;
  notes?: string;
  startDate: Date;
  endDate?: Date;
  estimatedDate?: Date;
  assignedTo: User;
  team: Team;
  components: Component[];
  developmentComponents: DevelopmentComponent[];
  recentActivities: RecentActivity[];
  upcomingDeployments: UpcomingDeployment[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface DevelopmentMetrics {
  total: number;
  inDevelopment: number;
  completed: number;
  cancelled: number;
  byEnvironment?: Record<string, number>;
}

export interface DevelopmentFilter {
  search?: string;
  status?: DevelopmentStatus;
  environment?: DevelopmentEnvironment;
  assignedTo?: number;
  team?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface DevelopmentPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DevelopmentSort {
  field: keyof Development;
  direction: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: DevelopmentPagination;
}

export interface ChartData {
  environment: string;
  count: number;
  color?: string;
}

export interface DashboardData {
  metrics: {
    total: number;
    inDevelopment: number;
    completed: number;
    cancelled: number;
  };
  developments: Development[];
  chartData: ChartData[];
  recentActivities: RecentActivity[];
}

export interface DevelopmentWithRelations extends Omit<Development, 'components'> {
  components: DevelopmentComponentRelation[];
  databases: DevelopmentDatabaseRelation[];
}

export interface DevelopmentComponentRelation {
  id: number;
  componentId: number;
  component: Component;
  notes: string;
  changeType: string;
  progress: string;
  version: string | null;
}

export interface DevelopmentDatabaseRelation {
  id: number;
  databaseId: number;
  database: Database;
  changeType: string;
  scriptDescription: string;
  notes: string;
}

export interface Database {
  id: number;
  name: string;
  description: string;
  type: string;
  version: string | null;
  isActive: boolean;
  environmentId: number;
  projectId: number | null;
  environment?: any;
  project?: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
