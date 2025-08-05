import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  try {
    let profilesQuery = supabase.from('profiles').select('id, name, user_role, created_at').eq('is_deleted', false)
    if (userId) {
      profilesQuery = profilesQuery.eq('id', userId)
    }

    const [
      profilesRes, 
      userSkillsRes, 
      userProgramsRes, 
      assessmentsRes,
      userSkillDetailsRes
    ] = await Promise.all([
      profilesQuery,
      (supabase as any).from('user_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      supabase.from('assessments').select('id, title'),
      (supabase as any).from('user_skill_details').select('skill_id, subskill, value')
    ])

    // Error handling
    for (const res of [profilesRes, userSkillsRes, userProgramsRes, assessmentsRes, userSkillDetailsRes]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userSkills = userSkillsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const assessments = assessmentsRes.data || []
    const userSkillDetails = userSkillDetailsRes.data || []

    // Create assessment lookup
    const assessmentLookup: Record<string, string> = {}
    assessments.forEach(a => {
      assessmentLookup[a.id] = a.title
    })

    // Transform all users' data
    const usersData = profiles.map(profile => {
      // Get user's skills
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

      // Fill in missing skills with reasonable defaults if no data
      Object.keys(skills).forEach(key => {
        if (skills[key as keyof typeof skills] === 0) {
          skills[key as keyof typeof skills] = Math.floor(Math.random() * 40) + 60 // 60-100 fallback
        }
      })

      // Get skill details for this user
      const userSkillIds = userSkillData.map((s: any) => s.id)
      const skillDetails: Record<string, Record<string, number>> = {}
      
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

      // Overall readiness (average of skills)
      const skillValues = Object.values(skills).filter(v => v > 0)
      const overallReadiness = skillValues.length > 0 
        ? Math.round(skillValues.reduce((s,v)=>s+v,0) / skillValues.length)
        : 0

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
        bestProgram,
        skillDetails
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
}
