export interface User {
  id: number
  user_id: string
  profile_id: string
  name: string
  role: string
  level: number
  skills: {
    vision: number
    grit: number
    logic: number
    algorithm: number
    problemSolving: number
    [key: string]: number // Add index signature for flexibility
  }
  overallReadiness: number
  programReadiness: Record<string, number>
  skillDetails: {
    [category: string]: {
      [subskill: string]: number
    }
  }
  gamingData: any
  visionBoard: any
  personalityExam: any
}

export interface DashboardData {
  userData: User[]
  totalUsers: number
  avgReadiness: number
  readyUsers: number
  coachingUsers: number
  readinessRanges: any[]
  avgSkills: any[]
  programReadiness: any[]
  programThresholds: any
  success: boolean
}

export interface UserTableData {
  userData: User[]
  success: boolean
}

export interface ReadinessRange {
  name: string
  count: number
}

export interface SkillData {
  subject: string
  A: number
}

export interface ProgramReadinessData {
  name: string
  readiness: number
  threshold: number
}
