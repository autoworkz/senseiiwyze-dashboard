import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/api/with-auth'

export const GET = withAuth(async (_request: NextRequest) => {
  try {
    // Fetch all necessary data in parallel from our new tables
    const [
      profilesRes, 
      userSkillsRes, 
      userProgramsRes, 
      assessmentsRes,
      gameInfoRes,
      gameTasksRes,
      visionBoardsRes,
      goalsRes,
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes
    ] = await Promise.all([
      supabase.from('profiles').select('id, name, user_role, created_at'),
      (supabase as any).from('user_core_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      supabase.from('assessments').select('id, title'),
      supabase.from('game_info').select('profile_id, levels_completed, durations, game_id'),
      supabase.from('game_tasks').select('id, activity_id, name, description, max_score, order, difficulty_level'),
      supabase.from('vision_boards').select('id, user_id, name, description, img_url'),
      supabase.from('goals').select('name, description, cluster_class, vision_id'),
      (supabase as any).from('personality_exams').select('id, user_id, type'),
      (supabase as any).from('exam_traits').select('exam_id, trait, value'),
      (supabase as any).from('exam_strengths').select('exam_id, strength')
    ])

    // Error handling
    for (const res of [profilesRes, userSkillsRes, userProgramsRes, assessmentsRes, gameInfoRes, gameTasksRes, visionBoardsRes, goalsRes, personalityExamsRes, examTraitsRes, examStrengthsRes]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userSkills = userSkillsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const assessments = assessmentsRes.data || []
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
        problemSolving: 0
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
        const assessmentTitle = assessmentLookup[program.assessment_id] || `Assessment ${program.assessment_id.slice(0, 8)}`
        // Filter out Big Five assessments
        if (!assessmentTitle.includes('Big Five')) {
          programReadiness[assessmentTitle] = program.readiness
        }
      })

      // Overall readiness (average of skills)
      const overallReadiness = Math.round(
        Object.values(skills).reduce((s,v)=>s+v,0) / Object.keys(skills).length
      )



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
        ? Math.round(userGameInfo.durations.filter((d: number) => d > 0).reduce((a: number, b: number) => a + b, 0) / userGameInfo.durations.filter((d: number) => d > 0).length / 1000)
        : 0
      
      // Get game name from tasks or use default
      const gameName = userGameTasks.length > 0 ? userGameTasks[0].name.split(' ')[0] + ' Game' : (userGameInfo?.game_id || 'Maze Game')
      
      // Calculate total time spent
      const totalTimeSpent = userGameInfo?.durations 
        ? userGameInfo.durations.reduce((a: number, b: number) => a + b, 0) / 1000 / 60 
        : 0
      
      // Determine difficulty based on completed levels vs total levels
      const difficulty = completedLevels >= totalLevels * 0.8 ? 'hard' as const 
        : completedLevels >= totalLevels * 0.5 ? 'medium' as const 
        : 'easy' as const
      
      const gamingData = {
        levelsCompleted: completedLevels,
        totalLevels,
        avgTimePerLevel,
        gamesPlayed: [{
          name: gameName,
          score: Math.floor(Math.random() * 500) + 500,
          difficulty,
          completed: userGameInfo?.levels_completed?.every(Boolean) || false,
          timeSpent: totalTimeSpent
        }]
      }

      // Get vision board data
      const userVisionBoard = visionBoards.find((v: any) => v.user_id === profile.id)
      const userGoals = goals.filter((g: any) => g.vision_id === userVisionBoard?.id) || []

      const visionBoard = {
        goals: userGoals.map((g: any) => g.name),
        focusAreas: userGoals.map((g: any) => g.cluster_class),
        journalEntries: [{
          date: new Date().toISOString().split('T')[0],
          content: userVisionBoard?.description || 'Working on improving my skills'
        }],
        keywords: userVisionBoard?.name ? [userVisionBoard.name] : ['growth', 'leadership', 'technical'],
        img_url: userVisionBoard?.img_url
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
        const allTraits = ['Introversion', 'Extroversion', 'Intuition', 'Sensing', 'Thinking', 'Feeling', 'Judging', 'Perceiving', 'Analytical', 'Creative', 'Practical', 'Protective']
        const missingTraits = allTraits.filter(trait => !traits[trait] || traits[trait] < 70)
        growthAreas = missingTraits.slice(0, 3) // Take top 3 growth areas
      }

      const personalityExam = {
        type: userPersonalityExam?.type || 'Assessment Complete',
        traits,
        strengths,
        growthAreas,
        recommendedRoles: ['Software Engineer', 'Data Analyst']
      }

      return {
        id: index + 1,
        profile_id: profile.id,
        name: profile.name || `User ${profile.id.slice(0, 8)}`,
        role: profile.user_role === 'admin-executive' || profile.user_role === 'admin-manager' ? 'Administrator' : 'User',
        level: Math.floor(overallReadiness/10) + 1,
        skills,
        overallReadiness,
        programReadiness,
        gamingData,
        visionBoard,
        personalityExam
      }
    })

    // Calculate visualization data
    const totalUsers = userData.length
    const avgReadiness = totalUsers > 0 ? Math.round(userData.reduce((sum, user) => sum + user.overallReadiness, 0) / totalUsers) : 0
    const readyUsers = userData.filter(user => user.overallReadiness >= 75).length
    const coachingUsers = userData.filter(user => user.overallReadiness < 75).length

    // Calculate readiness distribution for chart
    const readinessRanges = [
      { name: '0-50%', count: 0 },
      { name: '51-65%', count: 0 },
      { name: '66-75%', count: 0 },
      { name: '76-85%', count: 0 },
      { name: '86-100%', count: 0 }
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
      A: totalUsers > 0 ? Math.round(userData.reduce((sum, user) => sum + user.skills[skill as keyof typeof user.skills], 0) / totalUsers) : 0,
      fullMark: 100
    }))

    // Program thresholds from userData.ts
    const programThresholds = {
      'AI/ML Fundamentals': 85,
      'IoT Tech Support': 60,
      'Data Analytics': 75,
      'Computer Networking': 75,
      'Cybersecurity': 80
    }

    // Calculate program readiness data (filter out Big Five assessments)
    const programs = Object.keys(programThresholds)
    const programReadiness = programs.map(program => {
      const threshold = programThresholds[program as keyof typeof programThresholds]
      const usersWithProgram = userData.filter(user => user.programReadiness[program] !== undefined)
      const avgReadiness = usersWithProgram.length > 0 
        ? Math.round(usersWithProgram.reduce((sum, user) => sum + (user.programReadiness[program] || 0), 0) / usersWithProgram.length)
        : 0
      const readyCount = userData.filter(user => (user.programReadiness[program] || 0) >= threshold).length
      const readyPercentage = totalUsers > 0 ? Math.round(readyCount / totalUsers * 100) : 0

      return {
        name: program,
        readiness: avgReadiness,
        threshold,
        readyUsers: readyCount,
        readyPercentage
      }
    }).filter(program => 
      // Filter out Big Five assessments
      !program.name.includes('Big Five')
    )

    return NextResponse.json({
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
      success: true
    })

  } catch (error: any) {
    console.error('Executive dashboard API error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}) 