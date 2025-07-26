// User Profile Types
export interface UserProfileData {
  id: string
  full_name: string
  employee_id: string
  department: string
  position: string
  manager_name: string
  start_date: string
  avatar_url?: string | null
  employment_status: "active" | "inactive" | "pending"
  program_readiness: "ready" | "in_progress" | "not_ready"
}

// Metrics Types
export interface MetricData {
  overall_score: number
  goal_achievement: number
  skill_development: number
  team_collaboration: number
}

export interface DetailedMetricsData {
  productivity_score: number
  quality_rating: number
  attendance_rate: number
  project_completion: number
  technical_skills: number
  communication: number
  leadership: number
  problem_solving: number
  program_readiness: {
    status: "ready" | "in_progress" | "not_ready"
    required_training: boolean
    certifications: boolean
    performance_threshold: boolean
    manager_approval: boolean
  }
  training_programs: Array<{
    name: string
    status: "completed" | "in_progress" | "not_started"
    progress: number
  }>
}

// Goals Types
export interface Goal {
  id: string
  title: string
  status: "completed" | "in_progress" | "pending" | "overdue"
  progress: number
  due_date?: string
  completion_date?: string
  description: string
}

// Activity Types
export interface ActivityItem {
  id: string
  date: string
  type: "feedback" | "achievement" | "goal" | "training"
  title: string
  description: string
}

// Layout Types
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface ActionButton {
  type: "button"
  variant?: "primary" | "secondary" | "outline"
  label: string
  icon?: string
  onClick?: () => void
}

// Chart Data Types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  [key: string]: string | number
}

export interface ComparisonData {
  category: string
  user_value: number
  peer_average: number
  target?: number
}

// Component Props Types
export interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export interface DashboardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  className?: string
}

export interface DashboardSectionProps {
  children: React.ReactNode
  gridSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  className?: string
}

// Status Types
export type StatusVariant = "ready" | "in_progress" | "not_ready" | "completed" | "pending" | "overdue" | "active" | "inactive"
export type ColorVariant = "blue" | "green" | "purple" | "orange" | "red" | "yellow"
export type ProgressType = "progress_circle" | "progress_bar" | "star_rating" | "percentage"

// Configuration Types
export interface StatusConfig {
  icon: React.ComponentType<any>
  color: string
  textColor?: string
  iconBg?: string
}

export interface ColorConfig {
  bg: string
  text: string
  ring: string
  gradient: string
}

// Complete Dashboard Data Interface
export interface UserDashboardData {
  user: UserProfileData
  metrics: MetricData
  detailed_metrics: DetailedMetricsData
  goals: Goal[]
  activities: ActivityItem[]
  performance_over_time?: TimeSeriesData[]
  peer_comparison?: ComparisonData[]
  goal_progress?: ChartDataPoint[]
  last_updated?: string
}