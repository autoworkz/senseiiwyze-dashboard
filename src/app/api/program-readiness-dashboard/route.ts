import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateInitials } from '@/utils/programreadiness'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Fetch all necessary data in parallel
    const [
      profilesRes, 
      userSkillsRes, 
      userProgramsRes, 
      assessmentsRes,
      userSkillDetailsRes,
      programRequirementsRes
    ] = await Promise.all([
      userId 
        ? supabase.from('profiles').select('id, name, user_role, created_at').eq('id', userId).eq('is_deleted', false)
        : supabase.from('profiles').select('id, name, user_role, created_at').eq('is_deleted', false),
      (supabase as any).from('user_skills').select('id, user_id, category, value'),
      (supabase as any).from('user_programs').select('user_id, assessment_id, readiness'),
      supabase.from('assessments').select('id, title, cover_url'),
      (supabase as any).from('user_skill_details').select('skill_id, subskill, value'),
      (supabase as any).from('program_skill_requirements').select('assessment_id, skill_key, required_score')
    ])

    // Error handling
    for (const res of [profilesRes, userSkillsRes, userProgramsRes, assessmentsRes, userSkillDetailsRes, programRequirementsRes]) {
      if (res.error) throw res.error
    }

    const profiles = profilesRes.data || []
    const userSkills = userSkillsRes.data || []
    const userPrograms = userProgramsRes.data || []
    const assessments = assessmentsRes.data || []
    const userSkillDetails = userSkillDetailsRes.data || []
    const programRequirements = programRequirementsRes.data || []

    let selectedUser = null;
    if (userId) {
      selectedUser = profiles.find(p => p.id === userId);
    } else {
      // Original logic to pick a random user if no userId is provided
      const timestamp = Date.now()
      const allUserSkillIds = userSkills.map((s: any) => s.id)
      const usersWithSkillDetails = userSkillDetails.filter((detail: any) => allUserSkillIds.includes(detail.skill_id))
      
      if (usersWithSkillDetails.length > 0) {
        const skillDetailUserIds = [...new Set(usersWithSkillDetails.map((detail: any) => {
          const skill = userSkills.find((s: any) => s.id === detail.skill_id)
          return skill?.user_id
        }))]
        
        if (skillDetailUserIds.length > 0) {
          const randomIndex = timestamp % skillDetailUserIds.length
          const randomUserId = skillDetailUserIds[randomIndex]
          const userWithSkillDetails = profiles.find(p => p.id === randomUserId)
          if (userWithSkillDetails) {
            selectedUser = userWithSkillDetails
          }
        }
      }
      if (!selectedUser && profiles.length > 0) {
        selectedUser = profiles[timestamp % profiles.length];
      }
    }
    
    if (!selectedUser) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 })
    }

    // Create assessment lookup with cover URLs
    const assessmentLookup: Record<string, { title: string, cover_url: string | null }> = {}
    assessments.forEach(a => {
      assessmentLookup[a.id] = { title: a.title, cover_url: a.cover_url }
    })

    // Create program requirements lookup
    const requirementsLookup: Record<string, Record<string, number>> = {}
    programRequirements.forEach((req: any) => {
      const assessmentTitle = assessmentLookup[req.assessment_id]?.title
      if (assessmentTitle) {
        if (!requirementsLookup[assessmentTitle]) {
          requirementsLookup[assessmentTitle] = {}
        }
        requirementsLookup[assessmentTitle][req.skill_key] = req.required_score
      }
    })

    // Get selected user's skills
    const userSkillData = userSkills.filter((s: any) => s.user_id === selectedUser.id)
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
    const userProgramData = userPrograms.filter((p: any) => p.user_id === selectedUser.id)
    const programReadiness: Record<string, number> = {}
    
    userProgramData.forEach((program: any) => {
      const assessmentInfo = assessmentLookup[program.assessment_id]
      const assessmentTitle = assessmentInfo?.title || `Assessment ${program.assessment_id.slice(0, 8)}`
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

    const userName = selectedUser.name || `User ${selectedUser.id.slice(0, 8)}`
    
    const userData = {
      id: selectedUser.id,
      name: userName,
      role: selectedUser.user_role === 'admin' ? 'Administrator' : 'User',
      level,
      skills,
      overallReadiness,
      programReadiness,
      bestProgram,
      skillDetails,
      initials: generateInitials(userName)
    }

    return NextResponse.json({
      user: userData,
      programRequirements: requirementsLookup,
      programCoverUrls: Object.fromEntries(
        Object.entries(assessmentLookup).map(([id, info]) => [info.title, info.cover_url])
      ),
      success: true
    })

  } catch (error: any) {
    console.error('Program readiness dashboard API error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
