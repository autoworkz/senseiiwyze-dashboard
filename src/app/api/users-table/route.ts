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
      personalityExamsRes,
      examTraitsRes,
      examStrengthsRes,
      examGrowthAreasRes,
      assessmentsRes,
      // Keep some existing tables for gaming and vision board data
      gameInfoRes, 
      visionBoardsRes, 
      goalsRes
    ] = await Promise.all([
      supabase.from('profiles').select('id, name, user_role, created_at'),
      (supabase as any).from('user_core_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      (supabase as any).from('personality_exams').select('id, user_id, type'),
      (supabase as any).from('exam_traits').select('exam_id, trait, value'),
      (supabase as any).from('exam_strengths').select('exam_id, strength'),
      (supabase as any).from('exam_growth_areas').select('exam_id, area'),
      supabase.from('assessments').select('id, title'),
      supabase.from('game_info').select('profile_id, game_id, levels_completed, durations, onboarding_completed'),
      (supabase as any).from('vision_boards').select('user_id, name, description, img_url'),
      (supabase as any).from('goals').select('vision_id, name, description, url, cluster_class')
    ])

    // Error handling
    for (const res of [profilesRes, userSkillsRes, userProgramsRes, personalityExamsRes, examTraitsRes, examStrengthsRes, examGrowthAreasRes, assessmentsRes, gameInfoRes, visionBoardsRes, goalsRes]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userSkills = userSkillsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const personalityExams = personalityExamsRes.data || []
    const examTraits = examTraitsRes.data || []
    const examStrengths = examStrengthsRes.data || []
    const examGrowthAreas = examGrowthAreasRes.data || []
    const assessments = assessmentsRes.data || []
    const gameInfo = gameInfoRes.data || []
    const visionBoards = visionBoardsRes.data || []

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
      const skillValues = Object.values(skills).filter(v => v > 0)
      const overallReadiness = skillValues.length > 0 
        ? Math.round(skillValues.reduce((s,v)=>s+v,0) / skillValues.length)
        : 0



      // Get personality exam data
      const userPersonalityExam = personalityExams.find((pe: any) => pe.user_id === profile.id)
      let personalityExam = {
        type: 'Not Assessed',
        traits: {
          Analytical: Math.floor(Math.random() * 40) + 60,
          Creative: Math.floor(Math.random() * 40) + 60,
          Persistent: Math.floor(Math.random() * 40) + 60,
          Logical: Math.floor(Math.random() * 40) + 60,
          Innovative: Math.floor(Math.random() * 40) + 60
        },
        strengths: ['Problem Solving', 'Analytical Thinking'],
        growthAreas: ['Communication', 'Leadership'],
        recommendedRoles: ['Software Engineer', 'Data Analyst']
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
          traits: Object.keys(traitsMap).length > 0 ? {...personalityExam.traits, ...traitsMap} : personalityExam.traits,
          strengths: strengths.length > 0 ? strengths.map((s: any) => s.strength) : personalityExam.strengths,
          growthAreas: growthAreas.length > 0 ? growthAreas.map((ga: any) => ga.area) : personalityExam.growthAreas,
          recommendedRoles: personalityExam.recommendedRoles
        }
      }

      // Get gaming data
      const userGameInfo = gameInfo.filter((gi: any) => gi.profile_id === profile.id)
      const gamingData = {
        levelsCompleted: userGameInfo.reduce((sum: number, gi: any) => sum + (gi.levels_completed || 0), 0),
        totalLevels: userGameInfo.length * 10, // Assume 10 levels per game
        avgTimePerLevel: userGameInfo.length > 0 ? 
          userGameInfo.reduce((sum: number, gi: any) => sum + (gi.durations || 0), 0) / userGameInfo.length / 60 : 0,
        gamesPlayed: userGameInfo.map((gi: any) => ({
          name: `Game ${gi.game_id}`,
          score: Math.floor(Math.random() * 500) + 500,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
          completed: gi.onboarding_completed || false,
          timeSpent: (gi.durations || 0) / 60
        }))
      }

             // Get vision board data
       const userVisionBoard = visionBoards.find((vb: any) => vb.user_id === profile.id)
       const visionBoard = {
         goals: userVisionBoard ? [userVisionBoard.name] : [],
         focusAreas: userVisionBoard ? [userVisionBoard.description] : [],
         journalEntries: [],
         keywords: [],
         img_url: userVisionBoard?.img_url
       }

      return {
        id: index + 1,
        user_id: profile.id,
        name: profile.name || `User ${profile.id.slice(0, 8)}`,
        role: profile.user_role === 'admin' ? 'Administrator' : 'User',
        level: Math.floor(overallReadiness/20) + 1,
        skills,
        overallReadiness,
        programReadiness,
        gamingData,
        visionBoard,
        personalityExam
      }
    })

    return NextResponse.json(userData)

  } catch (error: any) {
    console.error('Users table API error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}) 