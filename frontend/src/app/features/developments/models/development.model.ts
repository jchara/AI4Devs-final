import { Environment } from './environment.model';

export interface Development {
  id: string;
  name: string;
  description: string;
  environment: Environment;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}