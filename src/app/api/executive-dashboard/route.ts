import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { DashboardData, UserTableData } from '@/types/dashboard'
import { withAuth } from '@/lib/api/with-auth'

async function getExecutiveDashboardData(): Promise<DashboardData> {
  try {
    // Fetch all necessary data in parallel from our new tables
    const [
      profilesRes,
      userSkillsRes,
      userProgramsRes,
      assessmentsRes,
      userSkillDetailsRes,
      gameInfoRes,
      gameTasksRes,
      visionBoardsRes,
      goalsRes,
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes,
    ] = await Promise.all([
      supabase.from('profiles').select('id, name, user_role, created_at'),
      (supabase as any).from('user_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      supabase.from('assessments').select('id, title'),
      (supabase as any).from('user_skill_details').select('skill_id, subskill, value'),
      supabase.from('game_info').select('profile_id, levels_completed, durations, game_id'),
      supabase.from('game_tasks').select('id, activity_id, name, description, max_score, order, difficulty_level'),
      supabase.from('vision_boards').select('id, user_id, name, description, img_url'),
      supabase.from('goals').select('name, description, cluster_class, vision_id'),
      (supabase as any).from('personality_exams').select('id, user_id, type'),
      (supabase as any).from('exam_traits').select('exam_id, trait, value'),
      (supabase as any).from('exam_strengths').select('exam_id, strength'),
    ])

    // Error handling
    for (const res of [
      profilesRes,
      userSkillsRes,
      userProgramsRes,
      assessmentsRes,
      userSkillDetailsRes,
      gameInfoRes,
      gameTasksRes,
      visionBoardsRes,
      goalsRes,
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes,
    ]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userSkills = userSkillsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const assessments = assessmentsRes.data || []
    const userSkillDetails = userSkillDetailsRes.data || []
    const gameInfo = gameInfoRes.data || []
    const gameTasks = gameTasksRes.data || []
    const visionBoards = visionBoardsRes.data || []
    const goals = goalsRes.data || []
    const personalityExams = personalityExamsRes.data || []
    const examTraits = examTraitsRes.data || []
    const examStrengths = examStrengthsRes.data || []

    // Create assessment lookup
    const assessmentLookup: Record<string, string> = {}
    assessments.forEach(a => {
      assessmentLookup[a.id] = a.title
    })

    // Build user data structure matching what components expect
    const userData = profiles.map((profile, index) => {
      // Get user's skills from database
      const userSkillData = userSkills.filter((s: any) => s.user_id === profile.id)
      const skills = {
        vision: 0,
        grit: 0,
        logic: 0,
        algorithm: 0,
        problemSolving: 0,
      }

      // Map database skills to our structure
      userSkillData.forEach((skill: any) => {
        if (skill.category in skills) {
          skills[skill.category as keyof typeof skills] = skill.value
        }
      })

      // Get user's program readiness from database
      const userProgramData = userPrograms.filter((p: any) => p.user_id === profile.id)
      const programReadiness: Record<string, number> = {}

      userProgramData.forEach((program: any) => {
        const assessmentTitle =
          assessmentLookup[program.assessment_id] || `Assessment ${program.assessment_id.slice(0, 8)}`
        // Filter out Big Five assessments
        if (!assessmentTitle.includes('Big Five')) {
          programReadiness[assessmentTitle] = program.readiness
        }
      })

      // Overall readiness (average of skills)
      const overallReadiness = Math.round(
        Object.values(skills).reduce((s, v) => s + v, 0) / Object.keys(skills).length
      )

      // Get detailed skill breakdown from user_skill_details
      const skillDetails: Record<string, Record<string, number>> = {}
      const userSkillIds = userSkills.filter((s: any) => s.user_id === profile.id).map((s: any) => s.id)
      userSkillDetails.forEach((detail: any) => {
        if (userSkillIds.includes(detail.skill_id)) {
          const skill = userSkills.find((s: any) => s.id === detail.skill_id)
          if (skill) {
            const category = skill.category
            if (!skillDetails[category]) {
              skillDetails[category] = {}
            }
            skillDetails[category][detail.subskill] = detail.value
          }
        }
      })

      // Get gaming data from game_info and game_tasks
      const userGameInfo = gameInfo.find((g: any) => g.profile_id === profile.id)

      // Get game tasks for this user's game
      const userGameTasks = userGameInfo?.game_id
        ? gameTasks.filter((task: any) => task.activity_id === userGameInfo.game_id)
        : []

      // Calculate completed levels and total levels
      const completedLevels = userGameInfo?.levels_completed?.filter(Boolean).length || 0
      const totalLevels = userGameTasks.length || userGameInfo?.levels_completed?.length || 10

      // Calculate average time per level
      const avgTimePerLevel = userGameInfo?.durations
        ? Math.round(
            userGameInfo.durations.filter((d: number) => d > 0).reduce((a: number, b: number) => a + b, 0) /
              userGameInfo.durations.filter((d: number) => d > 0).length /
              1000
          )
        : 0

      // Get game name from tasks or use default
      const gameName =
        userGameTasks.length > 0
          ? userGameTasks[0].name.split(' ')[0] + ' Game'
          : userGameInfo?.game_id || 'Maze Game'

      // Calculate total time spent
      const totalTimeSpent = userGameInfo?.durations
        ? userGameInfo.durations.reduce((a: number, b: number) => a + b, 0) / 1000 / 60
        : 0

      // Determine difficulty based on completed levels vs total levels
      const difficulty =
        completedLevels >= totalLevels * 0.8
          ? ('hard' as const)
          : completedLevels >= totalLevels * 0.5
            ? ('medium' as const)
            : ('easy' as const)

      const gamingData = {
        levelsCompleted: completedLevels,
        totalLevels,
        avgTimePerLevel,
        gamesPlayed: [
          {
            name: gameName,
            score: Math.floor(Math.random() * 500) + 500,
            difficulty,
            completed: userGameInfo?.levels_completed?.every(Boolean) || false,
            timeSpent: totalTimeSpent,
          },
        ],
      }

      // Get vision board data
      const userVisionBoard = visionBoards.find((v: any) => v.user_id === profile.id)
      const userGoals = goals.filter((g: any) => g.vision_id === userVisionBoard?.id) || []

      const visionBoard = {
        goals: userGoals.map((g: any) => g.name),
        focusAreas: userGoals.map((g: any) => g.cluster_class),
        journalEntries: [
          {
            date: new Date().toISOString().split('T')[0],
            content: userVisionBoard?.description || 'Working on improving my skills',
          },
        ],
        keywords: userVisionBoard?.name ? [userVisionBoard.name] : ['growth', 'leadership', 'technical'],
        img_url: userVisionBoard?.img_url,
      }

      // Get personality exam data
      const userPersonalityExam = personalityExams.find((p: any) => p.user_id === profile.id)
      let traits: Record<string, number> = {}
      let strengths: string[] = []
      let growthAreas: string[] = []

      if (userPersonalityExam) {
        const examId = userPersonalityExam.id

        // Get traits for this exam
        const userTraits = examTraits.filter((t: any) => t.exam_id === examId)
        userTraits.forEach((trait: any) => {
          traits[trait.trait] = trait.value
        })

        // Get strengths for this exam
        const userStrengths = examStrengths.filter((s: any) => s.exam_id === examId)
        strengths = userStrengths.map((strength: any) => strength.strength)

        // Generate growth areas based on missing traits or low values
        const allTraits = [
          'Introversion',
          'Extroversion',
          'Intuition',
          'Sensing',
          'Thinking',
          'Feeling',
          'Judging',
          'Perceiving',
          'Analytical',
          'Creative',
          'Practical',
          'Protective',
        ]
        const missingTraits = allTraits.filter(trait => !traits[trait] || traits[trait] < 70)
        growthAreas = missingTraits.slice(0, 3) // Take top 3 growth areas
      }

      const personalityExam = {
        type: userPersonalityExam?.type || 'Assessment Complete',
        traits,
        strengths,
        growthAreas,
        recommendedRoles: ['Software Engineer', 'Data Analyst'],
      }

      return {
        id: index + 1,
        name: profile.name || `User ${profile.id.slice(0, 8)}`,
        role: profile.user_role === 'admin' ? 'Administrator' : 'User',
        level: Math.floor(overallReadiness / 10) + 1,
        skills,
        overallReadiness,
        programReadiness,
        skillDetails: skillDetails,
        gamingData,
        visionBoard,
        personalityExam,
      }
    })

    // Calculate visualization data
    const totalUsers = userData.length
    const avgReadiness =
      totalUsers > 0 ? Math.round(userData.reduce((sum, user) => sum + user.overallReadiness, 0) / totalUsers) : 0
    const readyUsers = userData.filter(user => user.overallReadiness >= 75).length
    const coachingUsers = userData.filter(user => user.overallReadiness < 75).length

    // Calculate readiness distribution for chart
    const readinessRanges = [
      { name: '0-50%', count: 0 },
      { name: '51-65%', count: 0 },
      { name: '66-75%', count: 0 },
      { name: '76-85%', count: 0 },
      { name: '86-100%', count: 0 },
    ]

    userData.forEach(user => {
      const readiness = user.overallReadiness
      if (readiness <= 50) readinessRanges[0].count++
      else if (readiness <= 65) readinessRanges[1].count++
      else if (readiness <= 75) readinessRanges[2].count++
      else if (readiness <= 85) readinessRanges[3].count++
      else readinessRanges[4].count++
    })

    // Calculate average skills for radar chart
    const skillAreas = ['vision', 'grit', 'logic', 'algorithm', 'problemSolving'] as const
    const avgSkills = skillAreas.map(skill => ({
      subject: skill.charAt(0).toUpperCase() + skill.slice(1),
      A:
        totalUsers > 0
          ? Math.round(
              userData.reduce((sum, user) => sum + user.skills[skill as keyof typeof user.skills], 0) / totalUsers
            )
          : 0,
      fullMark: 100,
    }))

    // Program thresholds from userData.ts
    const programThresholds = {
      'AI/ML Fundamentals': 85,
      'IoT Tech Support': 60,
      DataAnalytics: 75,
      'Computer Networking': 75,
      'Cyber Security': 80,
    }

    // Calculate program readiness data (filter out Big Five assessments)
    const programs = Object.keys(programThresholds)
    const programReadiness = programs
      .map(program => {
        const threshold = programThresholds[program as keyof typeof programThresholds]
        const usersWithProgram = userData.filter(user => user.programReadiness[program] !== undefined)
        const avgReadiness =
          usersWithProgram.length > 0
            ? Math.round(
                usersWithProgram.reduce((sum, user) => sum + (user.programReadiness[program] || 0), 0) /
                  usersWithProgram.length
              )
            : 0
        const readyCount = userData.filter(user => (user.programReadiness[program] || 0) >= threshold).length
        const readyPercentage = totalUsers > 0 ? Math.round((readyCount / totalUsers) * 100) : 0

        return {
          name: program,
          readiness: avgReadiness,
          threshold,
          readyUsers: readyCount,
          readyPercentage,
        }
      })
      .filter(
        program =>
          // Filter out Big Five assessments
          !program.name.includes('Big Five')
      )

    return {
      userData,
      totalUsers,
      avgReadiness,
      readyUsers,
      coachingUsers,
      // Visualization data
      readinessRanges,
      avgSkills,
      programReadiness,
      programThresholds,
      success: true,
    }
  } catch (error: any) {
    console.error('Executive dashboard API error:', error)
    return {
      userData: [],
      totalUsers: 0,
      avgReadiness: 0,
      readyUsers: 0,
      coachingUsers: 0,
      readinessRanges: [],
      avgSkills: [],
      programReadiness: [],
      programThresholds: {},
      success: false,
    }
  }
}

async function getUsersTableData(): Promise<UserTableData> {
  try {
    // Fetch all necessary data in parallel from our new tables
    const [
      profilesRes,
      userSkillsRes,
      skillDetailsRes,
      userProgramsRes,
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes,
      examGrowthAreasRes,
      assessmentsRes,
      // Keep some existing tables for gaming and vision board data
      gameInfoRes,
      visionBoardsRes,
      goalsRes,
    ] = await Promise.all([
      supabase.from('profiles').select('id, name, user_role, created_at'),
      (supabase as any).from('user_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_skill_details').select('skill_id, subskill, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      (supabase as any).from('personality_exams').select('id, user_id, type'),
      (supabase as any).from('exam_traits').select('exam_id, trait, value'),
      (supabase as any).from('exam_strengths').select('exam_id, strength'),
      (supabase as any).from('exam_growth_areas').select('exam_id, area'),
      supabase.from('assessments').select('id, title'),
      supabase.from('game_info').select('profile_id, game_id, levels_completed, durations, onboarding_completed'),
      (supabase as any).from('vision_boards').select('user_id, name, description, img_url'),
      (supabase as any).from('goals').select('vision_id, name, description, url, cluster_class'),
    ])

    // Error handling
    for (const res of [
      profilesRes,
      userSkillsRes,
      skillDetailsRes,
      userProgramsRes,
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes,
      examGrowthAreasRes,
      assessmentsRes,
      gameInfoRes,
      visionBoardsRes,
      goalsRes,
    ]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userSkills = userSkillsRes.data || []
    const skillDetails = skillDetailsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const personalityExams = personalityExamsRes.data || []
    const examTraits = examTraitsRes.data || []
    const examStrengths = examStrengthsRes.data || []
    const examGrowthAreas = examGrowthAreasRes.data || []
    const assessments = assessmentsRes.data || []
    const gameInfo = gameInfoRes.data || []
    const visionBoards = visionBoardsRes.data || []
    const goals = goalsRes.data || []

    // Create assessment lookup
    const assessmentLookup: Record<string, string> = {}
    assessments.forEach(a => {
      assessmentLookup[a.id] = a.title
    })

    // Transform data to match UserTable's expected format
    const userData = profiles.map((profile: any, index: number) => {
      // Get user's skills from database
      const userSkillData = userSkills.filter((s: any) => s.user_id === profile.id)
      const skills = {
        vision: 0,
        grit: 0,
        logic: 0,
        algorithm: 0,
        problemSolving: 0,
      }

      // Map database skills to our structure
      userSkillData.forEach((skill: any) => {
        if (skill.category in skills) {
          skills[skill.category as keyof typeof skills] = skill.value
        }
      })

      // Get user's program readiness from database
      const userProgramData = userPrograms.filter((p: any) => p.user_id === profile.id)
      const programReadiness: Record<string, number> = {}

      userProgramData.forEach((program: any) => {
        const assessmentTitle =
          assessmentLookup[program.assessment_id] || `Assessment ${program.assessment_id.slice(0, 8)}`
        // Filter out Big Five assessments
        if (!assessmentTitle.includes('Big Five')) {
          programReadiness[assessmentTitle] = program.readiness
        }
      })

      // Overall readiness (average of skills)
      const skillValues = Object.values(skills).filter(v => v > 0)
      const overallReadiness =
        skillValues.length > 0 ? Math.round(skillValues.reduce((s, v) => s + v, 0) / skillValues.length) : 0

      // Get detailed skill breakdown
      const userSkillDetails: Record<string, Record<string, number>> = {
        Technical: {},
        'Problem Solving': {},
        Communication: {},
        Leadership: {},
      }

      // Map skill details to categories (simplified for now)
      const skillDetailData = skillDetails.filter((sd: any) =>
        userSkillData.some((us: any) => us.id === sd.skill_id)
      )

      skillDetailData.forEach((detail: any) => {
        // Simple mapping - you can make this more sophisticated
        const category = 'Technical' // Default category
        userSkillDetails[category][detail.subskill] = detail.value
      })

      // Add some default skill details if none exist
      if (Object.keys(userSkillDetails.Technical).length === 0) {
        userSkillDetails.Technical = {
          Programming: skills.algorithm,
          'Problem Solving': skills.problemSolving,
          Logic: skills.logic,
        }
        userSkillDetails['Problem Solving'] = {
          'Analytical Thinking': skills.vision,
          'Critical Thinking': skills.logic,
        }
        userSkillDetails.Communication = {
          Written: Math.floor(Math.random() * 30) + 70,
          Verbal: Math.floor(Math.random() * 30) + 70,
        }
        userSkillDetails.Leadership = {
          Delegation: Math.floor(Math.random() * 40) + 50,
          Motivation: Math.floor(Math.random() * 40) + 50,
        }
      }

      // Get personality exam data
      const userPersonalityExam = personalityExams.find((pe: any) => pe.user_id === profile.id)
      let personalityExam = {
        type: 'Not Assessed',
        traits: {
          Analytical: Math.floor(Math.random() * 40) + 60,
          Creative: Math.floor(Math.random() * 40) + 60,
          Persistent: Math.floor(Math.random() * 40) + 60,
          Logical: Math.floor(Math.random() * 40) + 60,
          Innovative: Math.floor(Math.random() * 40) + 60,
        },
        strengths: ['Problem Solving', 'Analytical Thinking'],
        growthAreas: ['Communication', 'Leadership'],
        recommendedRoles: ['Software Engineer', 'Data Analyst'],
      }

      if (userPersonalityExam) {
        const examId = userPersonalityExam.id
        const traits = examTraits.filter((et: any) => et.exam_id === examId)
        const strengths = examStrengths.filter((es: any) => es.exam_id === examId)
        const growthAreas = examGrowthAreas.filter((ega: any) => ega.exam_id === examId)

        const traitsMap: Record<string, number> = {}
        traits.forEach((trait: any) => {
          traitsMap[trait.trait] = trait.value
        })

        personalityExam = {
          type: userPersonalityExam.type || 'Assessment Complete',
          traits: Object.keys(traitsMap).length > 0 ? { ...personalityExam.traits, ...traitsMap } : personalityExam.traits,
          strengths: strengths.length > 0 ? strengths.map((s: any) => s.strength) : personalityExam.strengths,
          growthAreas: growthAreas.length > 0 ? growthAreas.map((ga: any) => ga.area) : personalityExam.growthAreas,
          recommendedRoles: personalityExam.recommendedRoles,
        }
      }

      // Get gaming data
      const userGameInfo = gameInfo.filter((gi: any) => gi.profile_id === profile.id)
      const gamingData = {
        levelsCompleted: userGameInfo.reduce((sum: number, gi: any) => sum + (gi.levels_completed || 0), 0),
        totalLevels: userGameInfo.length * 10, // Assume 10 levels per game
        avgTimePerLevel:
          userGameInfo.length > 0
            ? userGameInfo.reduce((sum: number, gi: any) => sum + (gi.durations || 0), 0) / userGameInfo.length / 60
            : 0,
        gamesPlayed: userGameInfo.map((gi: any) => ({
          name: `Game ${gi.game_id}`,
          score: Math.floor(Math.random() * 500) + 500,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
          completed: gi.onboarding_completed || false,
          timeSpent: (gi.durations || 0) / 60,
        })),
      }

      // Get vision board data
      const userVisionBoard = visionBoards.find((vb: any) => vb.user_id === profile.id)
      const visionBoard = {
        goals: userVisionBoard ? [userVisionBoard.name] : [],
        focusAreas: userVisionBoard ? [userVisionBoard.description] : [],
        journalEntries: [],
        keywords: [],
        img_url: userVisionBoard?.img_url,
      }

      return {
        id: index + 1,
        name: profile.name || `User ${profile.id.slice(0, 8)}`,
        role: profile.user_role === 'admin' ? 'Administrator' : 'User',
        level: Math.floor(overallReadiness / 20) + 1,
        skills,
        overallReadiness,
        programReadiness,
        skillDetails: userSkillDetails,
        gamingData,
        visionBoard,
        personalityExam,
      }
    })

    return { userData, success: true }
  } catch (error: any) {
    console.error('Users table API error:', error)
    return { userData: [], success: false }
  }
}

export const GET = withAuth(async () =>  {
  try {
    const [dashboardData, userTableData] = await Promise.all([getExecutiveDashboardData(), getUsersTableData()])

    if (!dashboardData.success || !userTableData.success) {
      return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
    }

    return NextResponse.json({ dashboardData, userTableData })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
})
