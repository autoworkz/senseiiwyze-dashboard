export interface UserData {
    id: string
    name: string
    role: string
    level: number
    skills: {
      vision: number
      grit: number
      logic: number
      algorithm: number
      problemSolving: number
    }
    overallReadiness: number
    programReadiness: Record<string, number>
    bestProgram: {
      name: string
      readiness: number
    }
    skillDetails: Record<string, Record<string, number>>
    parentSkillsProficiency?: Record<string, number>
    initials: string
}
