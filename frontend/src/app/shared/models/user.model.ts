export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  teamId: number;
  role?: Role;
  team?: Team;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
