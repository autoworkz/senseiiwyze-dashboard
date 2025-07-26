// User data models
export interface UserMetadata {
  location?: string;
  timezone?: string;
  preferences: Record<string, unknown>;
  tags: string[];
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  programReadiness: number;
  lastActive: string; // ISO string or relative time
  createdAt: string; // ISO string
  metadata: UserMetadata;
  department?: string;
  completedModules?: number;
  totalModules?: number;
}

// Filter and pagination models
export interface UserFilters {
  search: string;
  status: UserStatus[];
  roles: UserRole[];
  dateRange?: { from: string; to: string };
  tags: string[];
}

export interface UserSorting {
  field: keyof User;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Activity history model
export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
} 