import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/api/with-auth'

export const GET = withAuth(async (_request: NextRequest) => {
  try {
    const [
      profilesRes, 
      userProgramsRes, 
      userCoreSkillsRes,
      assessmentsRes
    ] = await Promise.all([
      supabase.from('profiles').select('id, name, user_role, created_at').eq('is_deleted', false),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      (supabase as any).from('user_core_skills').select('id, user_id, category, value'),
      supabase.from('assessments').select('id, title')
    ])

    // Error handling
    for (const res of [profilesRes, userProgramsRes, userCoreSkillsRes, assessmentsRes]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userPrograms = userProgramsRes.data || []
    const userCoreSkills = userCoreSkillsRes.data || []
    const assessments = assessmentsRes.data || []

    // Create assessment lookup
    const assessmentLookup: Record<string, string> = {}
    assessments.forEach(a => {
      assessmentLookup[a.id] = a.title
    })

    // Transform all users' data
    const usersData = profiles.map(profile => {
      const userCoreSkillsData = userCoreSkills.filter((s: any) => s.user_id === profile.id)
      const skills = {
        vision: 0,
        grit: 0,
        logic: 0,
        algorithm: 0,
        problemSolving: 0
      }
      userCoreSkillsData.forEach((skill: any) => {
        if (skill.category in skills) {
          skills[skill.category as keyof typeof skills] = skill.value
        }
      })
      // Get user's program readiness
      const userProgramData = userPrograms.filter((p: any) => p.user_id === profile.id)
      const programReadiness: Record<string, number> = {}
      
      userProgramData.forEach((program: any) => {
        const assessmentTitle = assessmentLookup[program.assessment_id] || `Assessment ${program.assessment_id.slice(0, 8)}`
        // Filter out Big Five assessments
        if (!assessmentTitle.includes('Big Five')) {
          programReadiness[assessmentTitle] = program.readiness
        }
      })

      // Overall readiness - will be calculated after skills are merged
      const overallReadiness = Math.floor(Math.random() * 40) + 60 // Temporary fallback

      // Find best program (highest readiness score)
      let bestProgram = { name: 'No Program', readiness: 0 }
      Object.entries(programReadiness).forEach(([program, readiness]) => {
        if (readiness > bestProgram.readiness) {
          bestProgram = { name: program, readiness }
        }
      })

      // Calculate user level based on overall readiness
      const level = Math.floor(overallReadiness / 10) + 1

      const userName = profile.name || `User ${profile.id.slice(0, 8)}`
      
      return {
        id: profile.id,
        name: userName,
        role: profile.user_role === 'admin' ? 'Administrator' : 'User',
        level,
        skills,
        overallReadiness,
        programReadiness,
        bestProgram
      }
    })

    return NextResponse.json({
      users: usersData,
      success: true
    })

  } catch (error: any) {
    console.error('User dashboard API error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}) 